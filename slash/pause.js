const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        queue.node.setPaused(true);
        await interaction.editReply("Music has been paused! Use '/resume' to resume playing");
    }
}