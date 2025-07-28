const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to a specific song in the queue')
        .addNumberOption((option) =>
        option.setName('songnumber').setDescription('The song number you want to skip to').setMinValue(1).setRequired(true)),
    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        const trackNum = interaction.options.getNumber('songnumber');
        if(trackNum > queue.tracks.size)
            return await interaction.editReply("That song is not in the queue!");
        
        queue.node.skipTo(trackNum - 1);
        await interaction.editReply(`Skipped to song ${trackNum}!`);
    }
}