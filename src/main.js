// Load dotenv
require('dotenv').config();
const { Discord, GatewayIntentBits, Client } = require('discord.js');

// Setup client and slash commands
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    restTimeOffset: 0,
    restWsBridgeTimeout: 100,
    retryLimit: 3,
    presence: {
        activities: [{
            name: 'with Discord.js!',
            type: 'PLAYING'
        }],
        status: 'online'
    }
});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Load commands
/*
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
};
*/ 
const fs = require('fs');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}
console.log(commands);

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// // Load slash commands
// const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
// (async () => {
//     try {
//         console.log('Started refreshing application (/) commands.');

//         await rest.put(
//             Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
//             { body: commands }
//         );

//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.error(error);
//     }
// })();

// Login
client.login(process.env.DISCORD_TOKEN);