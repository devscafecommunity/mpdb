// Load dotenv
require('dotenv').config();
const { Discord, GatewayIntentBits, Client } = require('discord.js');

// Setup client and slash commands
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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
    name: 'buy',
    description: 'Open the shop.',
    async execute(interaction) {

    },
    options: [
        {
            name: 'item',
            description: 'Item to buy',
            type: 3,
            required: true
        }
    ]
}
*/ 
const fs = require('fs');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

// Command handler
client.on('interactionCreate', async Interaction => {
    if (!Interaction.isCommand()) return;
    const { commandName } = Interaction;
    
    for (const command of commands) {
        if (command.name === commandName) {
            try {
                await command.execute(Interaction);
            } catch (error) {
                console.error(error);
                await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
});

// Event handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


// Load slash commands
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;
const rest = new REST({ version: '9' }).setToken(TOKEN);

async function main(){
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands,
            }
        );

        console.log('Successfully reloaded application (/) commands.');

        client.login(TOKEN);
    } catch (error) {
        console.error(error);
    }
}

main();