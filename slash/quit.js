const { slashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new slashCommandBuilder()
        .setName('quit')
        .setDescription('Stops the bot and clears the queue'),
    run: async({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

            queue.destroy();
            await interaction.editReply("Bye bye!");
    }
}