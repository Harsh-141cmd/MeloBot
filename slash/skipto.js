const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to a specific song in the queue')
        .addNumberOption((option) =>
        option.setName('song number').setDescription('The song number you want to skip to').setMinValue(1).setRequired(true)),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            const trackNum = interaction.options.getNumber('song number');
            if(trackNum > queue.tracks.length)
                return await interaction.editReply("That song is not in the queue!");
            queue.skipTo(songNum - 1);

            await interaction.editReply("Skipped to song ${trackNum}!");
    }
}