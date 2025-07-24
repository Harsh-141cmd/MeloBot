const { slashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new slashCommandBuilder()
        .setName('info')
        .setDescription('Displays info about the current song'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            let bar = quque.createProgressBar({
                queue: false,
                length: 19,

            })

            const song = queue.current;

            await interaction.editReply({
                embed: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription('**Currently Playing[${song.title}](${song.url})\n\n' + bar)
            ],
            });
    }
}