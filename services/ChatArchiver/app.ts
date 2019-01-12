import axios from 'axios'
import * as colors from 'colors/safe'
import * as winston from 'winston'

import * as WebSocket from 'ws'
// import './WebSocketClient'

const CHAT_MANIFEST_URL = 'https://www.stream.me/api-web/v1/chat/room/';
const WEB_SOCKET        = 'wss://www.stream.me/api-rooms/v3/ws';


const CHAT_USERNAME = process.argv[2] || 'danishpolice';


//////////////////////////////////////////

import * as firebase from 'firebase/app';

import 'firebase/auth'
import 'firebase/firestore'

if ( !firebase.apps.length )
{
    firebase.initializeApp({
        apiKey: "AIzaSyDvxIMp478PdHkDgWoKVzmhSK2v_xa2Tmo",
        authDomain: "localhost:300",
        projectId: "stream-me-24710",
        messagingSenderId: "820622786644",
        // databaseURL: "xxx",
    })
}

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

const docRef = db.collection('chatlogs').doc(CHAT_USERNAME).collection('messages');

//////////////////////////////////////////


const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'chat.log' }),
    ],
});


const getRoomId = async (username) => {
    const url = `https://stream.me/api-user/v2/${username}/app/web/channel`;

    const resp = await axios.get(url);
    const userId = resp.data['userPublicId'];

    return `user:${userId}:web`;
};

/**
 * Fetches the chat manifest from the given path.
 *
 * @param {string} room - The room we want to look at
 * @return {Promise<Object>} promise resolving to chat manifest object
 */
const getChatManifest = async ( room ) => {
    const path = `${CHAT_MANIFEST_URL}${room}`;
    console.log(path);
    const resp = await axios.get(path);
    return resp.data;
};

/**
 * Gets the final value of the node from the given subnode of the manifest.
 *
 * @param {*} node - The node to convert
 * @param {Object} manifestItem - The part of manifest for this node
 * @param {Object} chatData - The rest of the parserManifest
 * @return {*} The converted object
 */
const getNodeValue = (node, manifestItem, chatData) => {
    // skip null values
    if (node === null) return null;

    switch (manifestItem.type) {
        case 'nestedArray':
            return node.map((item) => parseMessageNode(item, manifestItem.nestedItems, chatData));
        case 'nestedObject':
            return parseMessageNode(node, manifestItem.nestedItems, chatData);
        case 'string':
        case 'url':
            return node.toString();
        case 'stringArray':
            return node.map(i => i.toString());
        case 'int':
            return parseInt(node);
        case 'intArray':
            return node.map((item) => parseInt(item));
        case 'urlTemplate':
            // hasMultipleTypes ignored for now
            const urlData = parseMessageNode(node, manifestItem.nestedItems, chatData);
            const key = urlData['key'];
            const template = chatData.urlTemplates[ key ];
            return template.replace(/{{n}}/g, () => {
                return urlData['vars'].shift();
            });
        case 'urlTemplates':
            return node.map(
                (item) => getNodeValue(item, { ...manifestItem, type: 'urlTemplate' }, chatData));
        default:
            throw new Error(`unknown type ${manifestItem.type}`);
    }
};

/**
 * Parses a specific node of the message tree.
 *
 * @param {*} node - The node to be parsed
 * @param {Object} manifest - The manifest subtree for this node
 * @param {Object} chatData - The rest of the parserManifest
 * @return {*} Parsed node
 */
const parseMessageNode = (node, manifest, chatData) =>
    Object.keys(manifest).reduce((acc, key) => {
        const manifestItem = manifest[key];
        const currentNode = node[manifestItem.index];

        acc[key] = getNodeValue(currentNode, manifestItem, chatData);

        return acc;
    }, {});

/**
 * Generates the hydrated message object from a chat message.
 *
 * @param {Object} message - The incoming message object from the websocket
 * @param {Object} manifest - The chat manifest
 * @return {Object} Hydrated message object
 */
const generateMessage = (message, manifest) => {
    const {
        parserManifests: {
            manifests: { v2: messageManifest },
            ...chatData
        }
    } = manifest;

    return parseMessageNode(message.data, messageManifest, chatData);
};

// Role to color map.
const roleColors = {
    guest     : colors.grey,
    user      : colors.white,
    moderator : colors.cyan,
    owner     : colors.red,
};

// Counts the amount of characters that are colors in the text.
const colorCharsCount = s => s.length - colors.stripColors(s).length;

/**
 * Updates a chat message, styling the emotes.
 *
 * @param {Object} data - The message
 * @return {Object} A new message object with the updated message
 */
const styleEmoticons = data => ({
    ...data,
    message: data.emoticons
        .reduce(
            (message, emote) =>
                emote.positions.reduce(
                    (m, pos) => colors.italic(emote.pattern) +
                                colors.bold(emote.pattern) +
                                m.substr(0, pos + colorCharsCount(m)) +
                                m.substr(pos + colorCharsCount(m) + emote.length),
                    message,
                ),
            data.message,
        ),
});

/**
 * Formats a message into a readable format from a chat object.
 *
 * @param {Object} message - The message object
 * @return {string} formatted message
 */
const formatMessage = message =>
    roleColors[message.actor.role](`${message.actor.username}: `) + styleEmoticons(message).message;

/**
 * Formats a message into a readable format from a chat object.
 *
 * @param {Object} message - The message object
 * @return {string} formatted message
 */
const logMessage = async message => {
    const msg = `${message.actor.username}: ${message.message}`;
    await docRef.add({
        author: message.actor.username,
        message: message.message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return msg;
};

/**
 * The main part of the program opening a websocket and watching messages.
 */
const main = async () => {
    const CHAT_ROOM_KEY = await getRoomId(CHAT_USERNAME);
    const manifest = await getChatManifest(CHAT_ROOM_KEY);

    // const ws = USE_CUSTOM_WS? new WebSocket(WEB_SOCKET) : new WebSocketClient(WEB_SOCKET);
    const ws = new WebSocket(WEB_SOCKET);

    ws.on('open', () => {
        console.log('Connected.');
        logger.info('Connected.');
        const joinRoom = JSON.stringify({ action: 'join', room: CHAT_ROOM_KEY });
        ws.send(`chat ${joinRoom}`);
    });

    ws.on('message', async (data:any) => {
        const message = JSON.parse(data.substr(13)); // skip 'chat message '

        if (message.type !== 'chat') return;

        const formedMessage = generateMessage(message, manifest);

        const msg = formatMessage(formedMessage);
        console.log(msg);

        const logMsg = await logMessage(formedMessage);
        logger.info(logMsg);
    });

    ws.on('close', (reason, number) => {
        console.log('Closed', reason, number)
    });

    ws.on('error', (e) => {
        console.log(e)
    });

};

if (require.main === module) main();
