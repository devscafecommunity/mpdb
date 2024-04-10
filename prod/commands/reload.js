module.exports = {
    name: 'reload',
    description: 'Reload the bot.',
    async execute(interaction) {
        await interaction.reply('Reloading...');
        // Runner manager will wait for error to be thrown

        throw new Error('Reloading bot...');

        await interaction.editReply('Reloaded!');
        await interaction.followUp({
            content: 'Reloaded!',
            ephemeral: true
        });
    }
}