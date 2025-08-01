const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the queue')
        .addNumberOption(option =>
            option.setName('page')
                .setDescription('Enter a page number')
                .setMinValue(1)
        ),

    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);
        if(!queue || !queue.node.isPlaying()) {
            return interaction.editReply("There are no songs in the queue");
        }
        const totalPages = Math.ceil(queue.tracks.size / 10) || 1;
        const page = (interaction.options.getNumber('page') || 1) - 1;

        if(page > totalPages) {
            return await interaction.editReply(`Invalid Page, There are only ${totalPages} pages of songs`);
        }

        const queueString = queue.tracks.toArray().slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>**`;
        }).join("\n");

        const currentSong = queue.currentTrack;
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : 'Nothing') +
                    `\n\n**Queue**\n${queueString}`)
                    .setFooter({
                        text: `Page ${page + 1} / ${totalPages}`
                    })
                    .setThumbnail(currentSong ? currentSong.thumbnail : null)
            ]
        })
    }
}