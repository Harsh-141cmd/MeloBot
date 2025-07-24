const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        const currentSong = queue.current;


        queue.skip();
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
            ]
        });
    }
}