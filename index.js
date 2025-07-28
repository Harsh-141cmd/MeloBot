const Discord = require('discord.js');
const dotenv = require('dotenv');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs');
const {Player} = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { SpotifyExtractor } = require('discord-player-spotify');
const { DeezerExtractor } = require('discord-player-deezer');

dotenv.config();

// Validate environment variables
const Token = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!Token) {
    console.error('ERROR: TOKEN is missing from .env file');
    process.exit(1);
}

if (!CLIENT_ID) {
    console.error('ERROR: CLIENT_ID is missing from .env file');
    process.exit(1);
}

// GUILD_ID is no longer required for global commands
// if (!GUILD_ID) {
//     console.error('ERROR: GUILD_ID is missing from .env file');
//     process.exit(1);
// }

const LOAD_SLASH = process.argv[2] == "load"

const client = new Discord.Client({
    intents : [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates,
    ]
})

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    skipFFmpeg: false,              // Enable FFmpeg (now that it's installed)
    ytdlOptions: {                  
        quality: 'highestaudio',    
        highWaterMark: 1 << 25,
        filter: 'audioonly'
    }
})

// Add player event listeners to handle errors properly
client.player.events.on('error', (queue, error) => {
    console.log(`Player error in ${queue.guild.name}: ${error.message}`);
});

client.player.events.on('playerError', (queue, error) => {
    console.log(`Player playback error in ${queue.guild.name}: ${error.message}`);
});

client.player.events.on('trackStart', (queue, track) => {
    console.log(`🎵 Now playing: ${track.title} in ${queue.guild.name}`);
    console.log(`   Duration: ${track.duration}`);
    console.log(`   Author: ${track.author}`);
    console.log(`   URL: ${track.url}`);
});

client.player.events.on('trackAdd', (queue, track) => {
    console.log(`➕ Track added to queue: ${track.title}`);
});

client.player.events.on('audioTrackAdd', (queue, track) => {
    console.log(`🔊 Audio track added: ${track.title}`);
});

client.player.events.on('disconnect', (queue) => {
    console.log(`❌ Disconnected from voice channel in ${queue.guild.name}`);
});

client.player.events.on('emptyChannel', (queue) => {
    console.log(`👥 Voice channel is empty in ${queue.guild.name}`);
});

client.player.events.on('emptyQueue', (queue) => {
    console.log(`📭 Queue is empty in ${queue.guild.name}`);
});

client.player.events.on('connectionCreate', (queue, connection) => {
    console.log(`🔗 Voice connection created in ${queue.guild.name}`);
});

client.player.events.on('debug', (message) => {
    // Only log important debug messages, not all the noise
    if (typeof message === 'string' && (
        message.includes('Playing') || 
        message.includes('Connected') || 
        message.includes('Stream') ||
        message.includes('Audio')
    )) {
        console.log(`Player debug: ${message}`);
    }
});

let commands = []

const slashfiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));
for (const files of slashfiles) {
    const slashcmd = require(`./slash/${files}`);
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    if(LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

if(LOAD_SLASH) {
    const rest = new REST({version: '9'}).setToken(Token);
    console.log('Deploying slash commands globally...');
    rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands})
    .then(() => {
        console.log('Successfully deployed slash commands globally');
        console.log('Note: Global commands may take up to 1 hour to appear in all servers');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}
else {
    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}`);
        
        // Load multiple platform extractors
        try {
            // YouTube support (most reliable)
            await client.player.extractors.register(YoutubeiExtractor, {});
            console.log('✅ YouTube extractor loaded successfully');
            
            // Spotify support (metadata only - requires YouTube for actual audio)
            await client.player.extractors.register(SpotifyExtractor, {
                clientId: process.env.SPOTIFY_CLIENT_ID || undefined,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET || undefined
            });
            console.log('✅ Spotify extractor loaded successfully');
            
            // Deezer support 
            await client.player.extractors.register(DeezerExtractor, {});
            console.log('✅ Deezer extractor loaded successfully');
            
            console.log('🎵 Multi-platform music support enabled!');
            console.log('Supported platforms: YouTube, Spotify, Deezer');
            
        } catch (extractorError) {
            console.error('❌ Error loading extractors:', extractorError);
        }
    })
    
    client.on("interactionCreate", async (interaction) => {
        async function handleCommand() {
            if(!interaction.isCommand()) return;
            const command = client.slashcommands.get(interaction.commandName);
            if(!command) return interaction.reply("Not a valid slash command");

            try {
                await command.run({client, interaction});
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply('There was an error while executing this command!');
                } else {
                    await interaction.reply('There was an error while executing this command!');
                }
            }
        }
        handleCommand();
    })
    
    client.login(Token);
}