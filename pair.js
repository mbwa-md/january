const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    Browsers, 
    makeCacheableSignalKeyStore 
} = require('@whiskeysockets/baileys');

const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    const startTime = Date.now();
    
    async function SILA_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        
        try {
            var items = ["Safari", "Chrome", "Firefox"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });
            
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }
            
            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                const latency = Date.now() - startTime;
                const performanceLevel = latency < 200 ? "🟢 Excellent" : latency < 500 ? "🟡 Good" : "🔴 Slow";
                
                if (connection == "open") {
                    await delay(3000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    
                    function generateSILA_ID() {
                        const prefix = "SILA";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let silaID = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            silaID += characters.charAt(randomIndex);
                        }
                        return silaID;
                    }
                    
                    const silaID = generateSILA_ID();
                    
                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let session_code = "sila~" + string_session;
                        
                        let code = await sock.sendMessage(sock.user.id, { text: session_code });
                        
                        let desc = `🚀 *SILA-MD SESSION* ✅
═══════════════════════

🔐 *Session ID:* Sent above
⚠️  *Warning:* Do not share this code!

╔► 𝐏𝐞𝐫𝐟𝐨𝐫𝐦𝐚𝐧𝐜𝐞 𝐋𝐞𝐯𝐞𝐥:
╠► ${performanceLevel}
╚► → 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐭𝐢𝐦𝐞: ${latency}𝐦𝐬

> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: 'SILA AI',
                                    body: 'WhatsApp ‧ Verified',
                                    thumbnailUrl: 'https://files.catbox.moe/36vahk.png',
                                    thumbnailWidth: 64,
                                    thumbnailHeight: 64,
                                    sourceUrl: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                                    mediaUrl: 'https://files.catbox.moe/36vahk.png',
                                    showAdAttribution: true,
                                    renderLargerThumbnail: false,
                                    previewType: 'PHOTO',
                                    mediaType: 1
                                },
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363402325089913@newsletter',
                                    newsletterName: 'SILA TECH',
                                    serverMessageId: Math.floor(Math.random() * 1000000)
                                },
                                isForwarded: true,
                                forwardingScore: 999
                            }
                        }, { quoted: code });
                        
                    } catch (e) {
                        let ddd = await sock.sendMessage(sock.user.id, { text: e.toString() });
                        
                        let desc = `🚀 *SILA-MD SESSION* ⚠️
═══════════════════════

🔐 *Session ID:* Sent above
❌ *Error:* Session created with minor issues

╔► 𝐏𝐞𝐫𝐟𝐨𝐫𝐦𝐚𝐧𝐜𝐞 𝐋𝐞𝐯𝐞𝐥:
╠► ${performanceLevel}
╚► → 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐭𝐢𝐦𝐞: ${latency}𝐦𝐬

> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: 'SILA AI',
                                    body: 'WhatsApp ‧ Verified',
                                    thumbnailUrl: 'https://files.catbox.moe/36vahk.png',
                                    thumbnailWidth: 64,
                                    thumbnailHeight: 64,
                                    sourceUrl: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                                    mediaUrl: 'https://files.catbox.moe/36vahk.png',
                                    showAdAttribution: true,
                                    renderLargerThumbnail: false,
                                    previewType: 'PHOTO',
                                    mediaType: 1
                                },
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363402325089913@newsletter',
                                    newsletterName: 'SILA TECH',
                                    serverMessageId: Math.floor(Math.random() * 1000000)
                                },
                                isForwarded: true,
                                forwardingScore: 999
                            }
                        }, { quoted: ddd });
                    }
                    
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 🔥 SILA-MD Session Connected ✅`);
                    await delay(10);
                    process.exit();
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    SILA_MD_PAIR_CODE();
                }
            });
            
        } catch (err) {
            console.log("⚠️ SILA-MD Connection failed — Restarting service...");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ SILA-MD Service Unavailable" });
            }
        }
    }
   
    return await SILA_MD_PAIR_CODE();
});

module.exports = router;
