const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription('Play a song from any platform')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('Song name, YouTube/Spotify/Deezer URL')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('playlist')
                .setDescription('Play a playlist from any platform')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('Playlist URL (YouTube/Spotify/Deezer)')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search for a song')
                .addStringOption(option =>
                    option.setName('searchterms')
                        .setDescription('Search terms for any platform')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('spotify')
                .setDescription('Play from Spotify')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Spotify track/album/playlist URL or search terms')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deezer')
                .setDescription('Play from Deezer')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Deezer track/album/playlist URL or search terms')
                        .setRequired(true)
                )
        ),
        run: async ({client, interaction}) => {
            if(!interaction.member.voice.channel) {
                return interaction.reply("You must be in a VC to use this command");
            }

            // Reply first, then defer for long operations
            await interaction.reply("🔍 Searching for music...");

            const queue = client.player.nodes.create(interaction.guild, {
                metadata: interaction.channel
            });
            
            try {
                if(!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch (error) {
                console.error('Voice connection error:', error);
                queue.delete();
                return interaction.editReply("Could not join your voice channel! Make sure I have permission to join and speak in voice channels.");
            }

            let embed = new EmbedBuilder()

            try {
                if(interaction.options.getSubcommand() === 'song'){
                    let song = interaction.options.getString('song');
                    console.log(`Searching for song: ${song}`);
                    
                    // Auto-detect platform and use appropriate search engine
                    let searchEngine = QueryType.AUTO;
                    if (song.includes('spotify.com')) {
                        searchEngine = QueryType.SPOTIFY_SONG;
                    } else if (song.includes('deezer.com')) {
                        searchEngine = QueryType.AUTO; // Deezer uses AUTO
                    } else if (song.includes('youtube.com') || song.includes('youtu.be')) {
                        searchEngine = QueryType.YOUTUBE_VIDEO;
                    }
                    
                    const result = await client.player.search(song, {
                        requestedBy: interaction.user,
                        searchEngine: searchEngine
                    })
                    
                    console.log(`Search result:`, result);
                    
                    if(result.tracks.length === 0) {
                        return interaction.editReply("No results found. Try a different search term or check if the song exists on the platform.");
                    }
                    const track = result.tracks[0];
                    await queue.addTrack(track);
                    embed
                        .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
                        .setThumbnail(track.thumbnail)
                        .setFooter({text: `Duration: ${track.duration} | Source: ${track.source}`})
                }

            else if(interaction.options.getSubcommand() === 'playlist'){
                let playlist = interaction.options.getString('playlist');
                console.log(`Searching for playlist: ${playlist}`);
                
                // Auto-detect playlist platform with better YouTube detection
                let searchEngine = QueryType.AUTO;
                if (playlist.includes('spotify.com/playlist') || playlist.includes('spotify.com/album')) {
                    searchEngine = QueryType.SPOTIFY_PLAYLIST;
                } else if (playlist.includes('deezer.com/playlist') || playlist.includes('deezer.com/album')) {
                    searchEngine = QueryType.AUTO;
                } else if (playlist.includes('youtube.com/playlist') || playlist.includes('youtu.be/playlist') || playlist.includes('list=')) {
                    // Force YouTube playlist search engine
                    searchEngine = QueryType.YOUTUBE_PLAYLIST;
                }
                
                console.log(`Using search engine: ${searchEngine} for playlist: ${playlist}`);
                
                const result = await client.player.search(playlist, {
                    requestedBy: interaction.user,
                    searchEngine: searchEngine
                })
                
                console.log(`Playlist search result:`, result);
                console.log(`Playlist tracks found: ${result.tracks.length}`);
                
                if(result.tracks.length === 0) {
                    return interaction.editReply("❌ No playlist results found. Make sure the playlist URL is valid and public.");
                }
                
                const playlistData = result.playlist;
                
                // Add tracks one by one since addTracks doesn't exist in v6
                for (const track of result.tracks) {
                    await queue.addTrack(track);
                }
                
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlistData?.title || 'Playlist'}](${playlistData?.url || playlist})** have been added to the queue`)
                    .setThumbnail(playlistData?.thumbnail || null)
                    .setFooter({text: `Source: ${playlistData?.source || 'YouTube'}`})
            }

            else if(interaction.options.getSubcommand() === 'search'){
                let searchTerms = interaction.options.getString('searchterms');
                console.log(`Searching for: ${searchTerms}`);
                
                const result = await client.player.search(searchTerms, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                
                console.log(`Search result:`, result);
                
                if(result.tracks.length === 0) {
                    return interaction.editReply("No search results found. Try different keywords or check spelling.");
                }
                const searchTrack = result.tracks[0];
                await queue.addTrack(searchTrack);
                embed
                    .setDescription(`**[${searchTrack.title}](${searchTrack.url})** has been added to the queue`)
                    .setThumbnail(searchTrack.thumbnail)
                    .setFooter({text: `Duration: ${searchTrack.duration} | Source: ${searchTrack.source}`})
            }

            else if(interaction.options.getSubcommand() === 'spotify'){
                let spotifyQuery = interaction.options.getString('query');
                console.log(`Searching Spotify for: ${spotifyQuery}`);
                
                // Determine Spotify search type
                let searchEngine = QueryType.SPOTIFY_SONG;
                if (spotifyQuery.includes('album/')) {
                    searchEngine = QueryType.SPOTIFY_ALBUM;
                } else if (spotifyQuery.includes('playlist/')) {
                    searchEngine = QueryType.SPOTIFY_PLAYLIST;
                }
                
                const result = await client.player.search(spotifyQuery, {
                    requestedBy: interaction.user,
                    searchEngine: searchEngine
                })
                
                console.log(`Spotify search result:`, result);
                
                if(result.tracks.length === 0) {
                    return interaction.editReply("No Spotify results found. Make sure the link is valid or try different search terms.");
                }
                
                if (result.playlist) {
                    // Add tracks one by one since addTracks doesn't exist in v6
                    for (const track of result.tracks) {
                        await queue.addTrack(track);
                    }
                    embed
                        .setDescription(`**${result.tracks.length} songs from Spotify ${result.playlist.type}: [${result.playlist.title}](${result.playlist.url})** have been added to the queue`)
                        .setThumbnail(result.playlist.thumbnail)
                        .setFooter({text: `Source: Spotify`})
                } else {
                    const track = result.tracks[0];
                    await queue.addTrack(track);
                    embed
                        .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
                        .setThumbnail(track.thumbnail)
                        .setFooter({text: `Duration: ${track.duration} | Source: Spotify`})
                }
            }

            else if(interaction.options.getSubcommand() === 'deezer'){
                let deezerQuery = interaction.options.getString('query');
                console.log(`Searching Deezer for: ${deezerQuery}`);
                
                const result = await client.player.search(deezerQuery, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                
                console.log(`Deezer search result:`, result);
                
                if(result.tracks.length === 0) {
                    return interaction.editReply("No Deezer results found. Make sure the link is valid or try different search terms.");
                }
                
                if (result.playlist) {
                    // Add tracks one by one since addTracks doesn't exist in v6
                    for (const track of result.tracks) {
                        await queue.addTrack(track);
                    }
                    embed
                        .setDescription(`**${result.tracks.length} songs from Deezer: [${result.playlist.title}](${result.playlist.url})** have been added to the queue`)
                        .setThumbnail(result.playlist.thumbnail)
                        .setFooter({text: `Source: Deezer`})
                } else {
                    const track = result.tracks[0];
                    await queue.addTrack(track);
                    embed
                        .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
                        .setThumbnail(track.thumbnail)
                        .setFooter({text: `Duration: ${track.duration} | Source: Deezer`})
                }
            }
            
            // Start playback if not already playing
            if(!queue.node.isPlaying()) {
                try {
                    console.log('Starting playback...');
                    await queue.node.play();
                    console.log('Playback started successfully');
                } catch (playError) {
                    console.error('Playback error:', playError);
                    return interaction.editReply('❌ Failed to play music. The track may be unavailable or region-locked.');
                }
            }
            
            return interaction.editReply({
                embeds: [embed]
            });
            
            } catch (searchError) {
                console.error('Search error details:', searchError);
                console.error('Search error stack:', searchError.stack);
                
                // Clean up queue if search fails
                if (queue) {
                    try {
                        queue.delete();
                    } catch (deleteError) {
                        console.error('Error deleting queue:', deleteError);
                    }
                }
                
                return interaction.editReply('❌ An error occurred while searching for music. Please try again later or check if the link is valid.');
            }
        }
}