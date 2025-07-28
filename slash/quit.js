const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Stops the bot and clears the queue'),
    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        queue.delete();
        await interaction.editReply("Bye bye!");
    }
}