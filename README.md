# 🎵 MeloBot - Multi-Platform Discord Music Bot

A feature-rich and refined Discord music bot that stands out from the rest, offering seamless support for YouTube, Spotify, and Deezer. Built on Discord.js v14 and discord-player v6 for powerful and reliable performance.

## ✨ Features

- 🎶 **Multi-Platform Support**: YouTube, Spotify, and Deezer
- 📋 **Playlist Support**: Handle playlists from all supported platforms
- 🎵 **High-Quality Audio**: FFmpeg integration for superior sound
- 🔄 **Queue Management**: Skip, pause, resume, shuffle, and more
- 🌐 **Global Slash Commands**: Modern Discord interface
- 🔒 **Secure**: Environment-based configuration

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `/play song <query>` | Play a song by search query or URL |
| `/play playlist <url>` | Play an entire playlist |
| `/play search <query>` | Search and select from results |
| `/play spotify <url>` | Play Spotify tracks/playlists |
| `/play deezer <url>` | Play Deezer tracks/playlists |
| `/pause` | Pause current track |
| `/resume` | Resume paused track |
| `/skip` | Skip current track |
| `/skipto <position>` | Skip to specific track in queue |
| `/queue` | Display current queue |
| `/shuffle` | Shuffle the queue |
| `/quit` | Stop playback and clear queue |
| `/info` | Bot information and statistics |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Discord Bot Token
- FFmpeg installed
- Spotify API credentials for enhanced Spotify support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-141cmd/MeloBot.git
   cd MeloBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   GUILD_ID=your_test_server_id_here
   
   # Optional Spotify API (for enhanced Spotify support)
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Run the bot**
   ```bash
   npm start
   ```


### Core Components

- **index.js**: Main bot file with player initialization
- **slash/**: Slash command handlers
  - `play.js`: Main music command with platform subcommands
  - `pause.js`, `resume.js`, `skip.js`: Playback controls
  - `queue.js`, `shuffle.js`: Queue management
  - `info.js`: Bot information
  - `quit.js`: Stop and cleanup

### Technology Stack

- **Discord.js v14**: Modern Discord API wrapper
- **discord-player v6**: Advanced music playing capabilities
- **discord-player-youtubei**: YouTube integration
- **discord-player-spotify**: Spotify integration  
- **discord-player-deezer**: Deezer integration
- **ffmpeg-static**: Audio processing

## 🎵 Supported Platforms

### YouTube
- ✅ Individual tracks
- ✅ Playlists
- ✅ Search functionality
- ✅ High-quality audio

### Spotify
- ✅ Individual tracks
- ✅ Playlists
- ✅ Albums
- ✅ Artist top tracks

### Deezer
- ✅ Individual tracks
- ✅ Playlists
- ✅ Albums
- ✅ Search functionality

## 🚨 Troubleshooting

### Common Issues

1. **"FFmpeg not found"**
   - The bot includes ffmpeg-static package
   - If issues persist, install FFmpeg system-wide

2. **"Missing permissions"**
   - Ensure bot has Voice permissions in target channels
   - Check bot role hierarchy

3. **"Command not found"**
   - Restart bot to deploy slash commands
   - Check if GUILD_ID is set for testing

4. **Audio quality issues**
   - Ensure stable internet connection
   - Try different audio sources

### Deployment Issues

1. **Render deployment fails**:
   - Check build logs for errors
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

2. **Bot doesn't respond after deployment**:
   - Check application logs in Render dashboard
   - Verify DISCORD_TOKEN is correct
   - Ensure bot has proper permissions in Discord server

3. **Commands not showing up**:
   - Wait a few minutes for global commands to sync
   - Check CLIENT_ID matches your Discord application
   - Restart the service in Render

### Debug Mode

Enable detailed logging by modifying the console.log statements in `index.js`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Harsh-141cmd/MeloBot/issues) page
2. Create a new issue with detailed information

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [discord-player](https://discord-player.js.org/) - Music framework
- [FFmpeg](https://ffmpeg.org/) - Audio processing
- YouTube, Spotify, and Deezer APIs

---

⭐ **Star this repository if you found it helpful!**

**Made with ❤️ by [Harsh-141cmd](https://github.com/Harsh-141cmd)**
