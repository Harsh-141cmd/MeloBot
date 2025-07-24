const Discord = require('discord.js');
const dotenv = require('dotenv');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs');
const {Player} = require('discord-player');


dotenv.config();
const Token = process.env.TOKEN;

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1201103817291337869"
const GUILD_ID = "1201258413892579508"

const client = new Discord.Client({
    intents : [
        "GUILDS",
        "GUILD_VOICE_STATES",
    ]
})

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {                  // Its stands for YouTube Downloader/ ytdl-core options
        quality: 'highestaudio',    // Highest audio quality
        highWaterMark: 1 << 25      // 32MB - Discord's max for streams
    },
})

let commands = []

const slashfiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));
for (const files of slashfiles) {
    const slashcmd = require(`./slashcommands/${files}`);
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    if(LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

if(LOAD_SLASH) {
    const rest = new REST({version: '9'}).setToken(Token);
    console.log('Deploying slash commands');
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log('Successfully deployed slash commands');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}
else {
    client.on('ready', () => {
        console.log('Logged in as ${client.user.tag}');
    })
    client.on("interactionCreate", async (interaction) => {
        async function handleCommand() {
            if(!interaction.isCommand()) return;
            const command = client.slashcommands.get(interaction.commandName);
            if(!slashcmd) interaction.reply("Not a valid slash command");

            await command.deferReply()
            await slashcmd.run(client, interaction)
        }
        handleCommand();
    })
    client.login(Token);
}