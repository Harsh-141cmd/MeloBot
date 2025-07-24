const { slashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new slashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription('Play a song')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('Enter a song name')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('playlist')
                .setDescription('Play a playlist')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('Enter a playlist name')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search a song')
                .addStringOption(option =>
                    option.setName('searchterms')
                        .setDescription('Enter a song name')
                        .setRequired(true)
                )
        ),
        run: async ({client, interaction}) => {
            if(!interaction.member.voice.channel)
                return interaction.editReply("You must be in a VC to use this command");

            const queue = await client.player.createQueue(interaction.guild);
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new MessageEmbed()

            if(interaction.options.getSubcommand() === 'song'){
                let url = interaction.options.getString('url');
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if(result.tracks.length === 0) {
                    return interaction.editReply("No results found");
                }
                const song = result.tracks[0];
                await queue.addTrack(song);
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the queue**`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: 'Duration: ${song.duration}'})
            }

            else if(interaction.options.getSubcommand() === 'playlist'){
                let song = interaction.options.getString('song');
                const result = await client.player.search(song, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if(result.tracks.length === 0) {
                    return interaction.editReply("No results found");
                }
                const playlist = result.playlist
                await queue.addTracks(result.tracks);
                embed
                    .setDescription(`**${result.tracks.length} songs from[${playlist.title}](${playlist.url})** have been added to the queue`)
                    .setThumbnail(song.thumbnail)
            }

            else if(interaction.options.getSubcommand() === 'search'){
                let url = interaction.options.getString('searchterms');
                const result = await client.player.search(song, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if(result.tracks.length === 0) {
                    return interaction.editReply("No results found");
                }
                const song = result.tracks[0];
                await queue.addTracks(song);
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the queue**`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: 'Duration: ${song.duration}'})
            }
            if(!queue.playing) await queue.play();
            await interaction.editReply({
                embeds: [embed]
            })
        }
}