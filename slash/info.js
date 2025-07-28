const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays info about the current song'),
    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        let bar = queue.node.createProgressBar({
            queue: false,
            length: 19,
        });

        const song = queue.currentTrack;

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setThumbnail(song.thumbnail)
                .setDescription(`**Currently Playing [${song.title}](${song.url})**\n\n${bar}`)
            ],
        });
    }
}