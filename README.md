# MeloBot - Discord Music Bot

A Discord music bot built with Discord.js v14 and discord-player v6.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your `.env` file with your bot credentials:
   ```env
   TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   ```
   
   Note: GUILD_ID is no longer needed as commands are deployed globally.

3. Deploy slash commands globally (run this once or when you add new commands):
   ```bash
   npm run deploy
   ```
   
   **Important**: Global commands may take up to 1 hour to appear in all servers.

4. Start the bot:
   ```bash
   npm start
   ```

## Available Commands

- `/play song [song_name]` - Play a single song from YouTube
- `/play playlist [playlist_url]` - Play a YouTube playlist
- `/play search [search_terms]` - Search and play a song
- `/pause` - Pause the current song
- `/resume` - Resume the paused song
- `/skip` - Skip the current song
- `/skipto [number]` - Skip to a specific song in the queue
- `/queue [page]` - View the current queue (paginated)
- `/info` - Show information about the currently playing song
- `/shuffle` - Shuffle the current queue
- `/quit` - Stop the bot and clear the queue

## Features

- High-quality audio streaming
- Queue management
- Playlist support
- Search functionality
- Progress bar for current song
- Error handling and validation

## Requirements

- Node.js v16 or higher
- A Discord Bot Token
- The bot must have permission to join voice channels and use slash commands
