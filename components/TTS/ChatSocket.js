import axios from 'axios'
import * as colors from 'colors/safe'
import * as WebSocket from 'ws'

const DEBUG = false;

// Stream.me API locations
const CHAT_MANIFEST_URL  = 'https://www.stream.me/api-web/v1/chat/room/';
const WEB_SOCKET_URL     = 'wss://www.stream.me/api-rooms/v3/ws';


const getRoomId = async username => {
    const url = `https://stream.me/api-user/v2/${username}/app/web/channel`;

    try {
        const resp   = await axios.get(url);
        const userId = resp.data['userPublicId'];
        return `user:${userId}:web`;
    } catch (e) {
        if (e.response)
            console.log(`${e.response.status} - ${e.response.statusText}`);
        else if (e.request)
            console.log(e.request);
        else
            console.log(e.message);
        return null;
    }
};

/**
 * Fetches the chat manifest from the given path.
 *
 * @param {string} roomKey - The room we want to look at
 * @return {Promise<Object>} promise resolving to chat manifest object
 */
const getChatManifest = async roomKey => {
    const path = `${CHAT_MANIFEST_URL}${roomKey}`;

    if (DEBUG) console.log(path);

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
            if (!template) return '';
            return template.replace(/{{n}}/g, () => {
                return urlData['vars'].shift();
            });
        case 'urlTemplates':
            return node.map( item => getNodeValue(item, { ...manifestItem, type: 'urlTemplate' }, chatData) );
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
const logMessageBatch = async message => {
    // console.log(`${ROLE_COLORS[message.actor.role](message.actor.username)}: ${message.message}`);
    const msg = `(${CHAT_USERNAME}) ${message.actor.username}: ${message.message}`;
    console.log(msg);
};


class ChatSocket {

    /**
     * Init state variables
     */
    constructor() {
        this.USERNAME      = null;
        this.CHAT_ROOM_KEY = null;
        this.CHAT_MANIFEST = null;

        this.ws            = null;
    }

    async connect(username) {
        this.USERNAME = username;

        const version = colors.bgGreen('v1.1.0');
        const welcome = colors.green(`Chat Dispatcher`);
        console.log(`${welcome} ${version}`);

        if ( await this.loadConfigs() === false ) return false;

        this.ws = new WebSocket(WEB_SOCKET_URL);
        this.ws.on( 'open',    async () => await this.onOpen() );
        this.ws.on( 'message', async (data, flags) => onMessage(data, CHAT_MANIFEST) );
        this.ws.on( 'close',   (reason, number) => this.onClose(reason, number) );
        this.ws.on( 'error',   e => console.log(e) );
    }

    async loadConfigs() {
        this.CHAT_ROOM_KEY = await getRoomId(this.USERNAME);
        if (!this.CHAT_ROOM_KEY) {
            console.log(`Failed to retrieve user ${this.USERNAME}!`);
            return false;
        }

        this.CHAT_MANIFEST = await getChatManifest(this.CHAT_ROOM_KEY);
        if (!this.CHAT_MANIFEST) {
            console.log(`Failed to retrieve chatroom manifest data.`);
            return false;
        }
    }

    onOpen() {
        console.log(`Connected to: ${colors.magenta(this.USERNAME)}.`);
        const joinRoom = JSON.stringify({ action: 'join', room: this.CHAT_ROOM_KEY });
        this.ws.send(`chat ${joinRoom}`);
    }

    async onMessage ( data, manifest ) {
        const message = JSON.parse(data.substr(13)); // skip 'chat message '
        if (message.type !== 'chat') return;
        const formedMessage = generateMessage(message, manifest);
        await logMessageBatch(formedMessage);
    }

    async onClose ( reason, number ) {
        console.log( 'Closed, Attempting to reconnect', reason, number );
        setTimeout( async () => await main(), 5000 );
    }
}
