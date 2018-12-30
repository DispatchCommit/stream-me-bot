const WebSocket = require("ws")
const https = require("https")
const util = require("util")
const colors = require("colors/safe")
const winston = require("winston");

// const CHAT_ROOM_KEY = process.env.CHAT_ROOM_KEY
const CHAT_ROOM_KEY = 'user:9a86d241-a30f-4c5e-bdc8-fcdd1a2517ee:web'
const CHAT_MANIFEST_URL = "https://www.stream.me/api-web/v1/chat/room/"
const WEB_SOCKET = "wss://www.stream.me/api-rooms/v3/ws"


const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});


/**
 * Fetches the chat manifest from the given path.
 *
 * @param {string} path - The path to fetch the chat manifest from
 * @return {Promise<Object>} promise resolving to chat manifest object
 */
const getChatManifest = (path = `${CHAT_MANIFEST_URL}${CHAT_ROOM_KEY}`) =>
  new Promise((resolve, reject) => {
    const req = https.request(path, (res) => {
        let content = ''

        res.on("data", (chunk) => content += chunk)
        res.on("end", () => resolve(content))
    })

    req.on("error", reject)

    req.end()
  }).then((text) => JSON.parse(text))
    .catch((e) => { throw e })

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
  if (node === null) return null

  switch (manifestItem.type) {
    case "nestedArray":
      return node.map((item) => parseMessageNode(item, manifestItem.nestedItems, chatData))
    case "nestedObject":
      return parseMessageNode(node, manifestItem.nestedItems, chatData)
    case "string":
    case "url":
      return node.toString()
    case "stringArray":
      return node.map(i => i.toString())
    case "int":
      return parseInt(node)
    case "intArray":
      return node.map((item) => parseInt(item))
    case "urlTemplate":
      // hasMultipleTypes ignored for now
      const urlData = parseMessageNode(node, manifestItem.nestedItems, chatData)
      const template = chatData.urlTemplates[urlData.key]
      return template.replace(/{{n}}/g, () => {
        return urlData.vars.shift()
      })
    case "urlTemplates":
      return node.map(
        (item) => getNodeValue(item, {...manifestItem, type: "urlTemplate"}, chatData))
    default:
      throw new Error(`unknown type ${manifestItem.type}`)
  }
}

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
    const manifestItem = manifest[key]
    const currentNode = node[manifestItem.index]

    acc[key] = getNodeValue(currentNode, manifestItem, chatData)

    return acc
  }, {})

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
  } = manifest

  return parseMessageNode(message.data, messageManifest, chatData)
}

// Role to color map.
const roleColors = {
  guest: colors.grey,
  user: colors.white.bold,
  moderator: colors.cyan.bold,
  owner: colors.red.bold,
}

// Counts the amount of characters that are colors in the text.
const colorCharsCount = s => s.length - colors.stripColors(s).length

/**
 * Updates a chat message, styling the emotes.
 *
 * @param {Object} data - The message
 * @return {Object} A new message object with the updated message
 */
const styleEmoticons = (data) => ({
  ...data,
  message: data.emoticons.reduce((message, emote) =>
    emote.positions.reduce((m, pos) =>
        m.substr(0, pos + colorCharsCount(m))
        + colors.bold.italic(emote.pattern)
        + m.substr(pos + colorCharsCount(m) + emote.length),
      message,
    ),
    data.message,
  ),
})

/**
 * Formats a message into a readable format from a chat object.
 *
 * @param {Object} message - The message object
 * @return {string} formatted message
 */
const formatMessage = (message) =>
  roleColors[message.actor.role](`<${message.actor.username}> `)
  + styleEmoticons(message).message

/**
 * Formats a message into a readable format from a chat object.
 *
 * @param {Object} message - The message object
 * @return {string} formatted message
 */
const formatMessage2 = (message) =>
  roleColors[message.actor.role](`<${message.actor.username}> `)
  + styleEmoticons(message).message

/**
 * The main part of the program opening a websocket and watching messages.
 */
const main = () => {
  getChatManifest()
    .then((manifest) => {
      const ws = new WebSocket(WEB_SOCKET)

      ws.on("open", () => {
        console.log("Connected.")
		logger.info("Connected.");
        ws.send("chat " + JSON.stringify({
          action: "join",
          room: CHAT_ROOM_KEY,
        }))
      })

      ws.on("message", (data) => {
        const message = JSON.parse(data.substr(13)) // skip "chat message "
        if (message.type !== "chat") return
		
		let msg = formatMessage(generateMessage(message, manifest))

        console.log(msg)
        // logger.info(msg)
		
        // console.log(data)
        logger.info(data)
      })

      ws.on("close", (reason, number) => {
        console.log("Closed", reason, number)
      })

      ws.on("error", (e) => {
        console.log(e)
      })
    })
}

if (require.main === module) main()