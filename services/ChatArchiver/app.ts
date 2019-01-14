import axios from 'axios'
import * as colors from 'colors/safe'
import * as winston from 'winston'
import * as WebSocket from 'ws'
// import './WebSocketClient'

const LOG_FILE_NAME : string     = 'chat';
const CHAT_USERNAME : string     = process.argv[2] || 'danishpolice';

// Stream.me API locations
const CHAT_MANIFEST_URL : string = 'https://www.stream.me/api-web/v1/chat/room/';
const WEB_SOCKET_URL : string    = 'wss://www.stream.me/api-rooms/v3/ws';

// Role to color map.
const ROLE_COLORS = {
    guest     : colors.grey,
    user      : colors.white,
    moderator : colors.cyan,
    owner     : colors.red,
    admin     : colors.red,
};


//////////////////////////////////////////

import * as firebase from 'firebase/app';

import 'firebase/auth'
import 'firebase/firestore'

if ( !firebase.apps.length )
{
    firebase.initializeApp({
        apiKey            : "AIzaSyDvxIMp478PdHkDgWoKVzmhSK2v_xa2Tmo",
        authDomain        : "localhost:300",
        projectId         : "stream-me-24710",
        messagingSenderId : "820622786644",
        // databaseURL: "xxx",
    })
}

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

const docRef = db.collection('chatlogs').doc(CHAT_USERNAME).collection('messages');

//////////////////////////////////////////

// Create Logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: `${LOG_FILE_NAME}.log` }),
    ],
});


const getRoomId = async (username: string) => {
    const url = `https://stream.me/api-user/v2/${username}/app/web/channel`;

    try {
        const resp   = await axios.get(url);
        const userId = resp.data['userPublicId'];
        return `user:${userId}:web`;
    } catch (e) {
        if (e.response) {
            console.log(`${e.response.status} - ${e.response.statusText}`);
        } else if (e.request) {
            console.log(e.request);
        } else {
            console.log(e.message);
        }
        return null;
    }
};

/**
 * Fetches the chat manifest from the given path.
 *
 * @param {string} roomKey - The room we want to look at
 * @return {Promise<Object>} promise resolving to chat manifest object
 */
const getChatManifest = async ( roomKey: string ) => {
    const path = `${CHAT_MANIFEST_URL}${roomKey}`;
    console.log(colors.green(CHAT_USERNAME));
    console.log(path);

    try {
        const resp = await axios.get(path);
        return resp.data;
    } catch (e) {
        console.log(e.response);
        return null;
    }
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
    ROLE_COLORS[message.actor.role](`${message.actor.username}: `) + styleEmoticons(message).message;

/**
 * Formats a message into a readable format from a chat object.
 *
 * @param {Object} message - The message object
 * @return {string} formatted message
 */
const logMessage = async message => {
    const msg = `(${CHAT_USERNAME}) ${message.actor.username}: ${message.message}`;
    logger.info(msg);

    await docRef.add({
        author    : message.actor.username,
        message   : message.message,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
    });

    return msg;
};

/**
 * The main part of the program opening a websocket and watching messages.
 */
const main = async () => {
    const CHAT_ROOM_KEY = await getRoomId(CHAT_USERNAME);
    if (!CHAT_ROOM_KEY) {
        console.log(`Failed to retrieve user ${CHAT_USERNAME}!`);
        return;
    }

    const CHAT_MANIFEST = await getChatManifest(CHAT_ROOM_KEY);
    if (!CHAT_MANIFEST) {
        console.log(`Failed to retrieve chatroom manifest data.`);
        return;
    }

    // const ws = USE_CUSTOM_WS? new WebSocket(WEB_SOCKET) : new WebSocketClient(WEB_SOCKET);
    const ws = new WebSocket(WEB_SOCKET_URL);

    ws.on('open', () => {
        console.log('Connected.');
        logger.info(`Connected to ${CHAT_USERNAME}.`);
        const joinRoom = JSON.stringify({ action: 'join', room: CHAT_ROOM_KEY });
        ws.send(`chat ${joinRoom}`);
    });

    ws.on('message', async (data:any) => {
        const message = JSON.parse(data.substr(13)); // skip 'chat message '

        if (message.type !== 'chat') return;

        const formedMessage = generateMessage(message, CHAT_MANIFEST);

        const msg = formatMessage(formedMessage);
        console.log(msg);

        await logMessage(formedMessage);
    });

    ws.on('close', (reason, number) => {
        console.log('Closed', reason, number)
    });

    ws.on('error', (e) => {
        console.log(e)
    });

};

if (require.main === module) main();
