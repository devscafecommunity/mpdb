// Load dotenv
require('dotenv').config();
const { Discord, GatewayIntentBits, Client } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

const clientFactory = require('./lib/factoryes/clientFactory');
const client = clientFactory();

// Commands
const commandloader = require('./lib/commands/commandloader');
const commandHandler = require('./lib/commands/commandhandler');

const commands = commandloader('./commands', '../../commands/');
commandHandler(client, commands);

// Events
const eventloader = require('./lib/events/eventloader');
const eventHandler = require('./lib/events/eventhandler');

const events = eventloader('./events', '../../events/');
eventHandler(client, events);

// Load main
const discordRestFactory = require('./lib/factoryes/discordRestFactory');

// Main server
const { BotServer, BotInstance } = require('./lib/main/botmanager');
const main = require('./lib/main/botmain');

const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;

const rest = discordRestFactory(TOKEN);
const routes = Routes;

// Comandos internos do servidor
let internalcommands = [
    /*
    Exemplo de comando
    {
        name: 'ping', <- Nome do comando
        description: 'Replies wiith bot conectivity and latency', <- Descrição do comando para o help
        execute(server){ <- Recursividade passada para o comando ou seja o proprio servidor
            server.io.on('connection', (socket) => {
                socket.emit('ping', 'pong');
            });
        }
    }
    */
    {
        name: 'restart',
        description: 'Restart the bot',
        execute(server){
            server.botInstance.restart();
        }
    },
    {
        name: 'stop',
        description: 'Stop the bot',
        execute(server){
            server.botInstance.stop();
        }
    },
    {
        name: 'start',
        description: 'Start the bot',
        execute(server){
            server.botInstance.start();
        }
    },
    {
        name: 'status',
        description: 'Check the bot status',
        execute(server){
            server.status();
        }
    },
    {
        name: 'killserver',
        description: 'Kill the server',
        execute(server){
            server.killserver();
        }
    },
    // Help
    {
        name: 'help',
        description: 'Show the help',
        execute(server){
            server.help();
        }
    }
];

const botInstance = new BotInstance(rest, routes, CLIENT_ID, TOKEN, client, commands);
const server = new BotServer(internalcommands, botInstance);

server.start();