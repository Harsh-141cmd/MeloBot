const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    run: async({client, interaction}) => {
        await interaction.deferReply();
        
        const queue = client.player.nodes.get(interaction.guildId);

        if(!queue) 
            return await interaction.editReply("There is no queue");

        queue.tracks.shuffle();
        await interaction.editReply(`Queue of ${queue.tracks.size} songs has been shuffled!`);
    }
}