const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            queue.setPaused(true);
            await interaction.editReply("Music has been paused! Use '/resume' to resume playing");
    }
}