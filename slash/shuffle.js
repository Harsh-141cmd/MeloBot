const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            queue.shuffle();
            await interaction.editReply("Queue of ${queue.tracks.length} has been shuffled!");
    }
}