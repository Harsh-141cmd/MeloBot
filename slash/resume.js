const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            queue.setPaused(false);
            await interaction.editReply("Music has been resumed! Use '/pause' to pause the music");
    }
}