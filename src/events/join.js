// Event join

module.exports = {
    name: 'join',
    once: false,
    async execute(member, client) {
        // Send welcome message
        const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
        if(!channel) return;
        channel.send(`Welcome to the server, ${member}!`);
    }
};