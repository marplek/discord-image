const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
require("dotenv").config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;
app.use(cors());
// Discord bot客户端初始化
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

app.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No image uploaded.');
    }

    const fileExtension = path.extname(file.originalname);
    const channelId = process.env.CHANNEL;
    const channel = await client.channels.fetch(channelId);

    const attachment = new AttachmentBuilder(file.path, `file${fileExtension}`);
    const message = await channel.send({ files: [attachment] });

    const attachmentUrl = message.attachments.first().url;
    console.log(attachmentUrl)

    fs.unlink(file.path, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
    });

    res.json({ imageUrl: attachmentUrl });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});