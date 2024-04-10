// The bot need to be able to self restart if it crashes or is stopped
// This is a simple way to do it

//This function is running the bot:
//main(rest, routes, CLIENT_ID, TOKEN, client, commands);



const http = require('http');
const socketIO = require('socket.io');
const botMain = require('./botmain.js');
const { emit } = require('process');

class BotInstance {
    constructor(rest, routes, CLIENT_ID, TOKEN, client, commands) {
        this.rest = rest;
        this.routes = routes;
        this.CLIENT_ID = CLIENT_ID;
        this.TOKEN = TOKEN;
        this.client = client;
        this.commands = commands;
        this.bot = null;
    }

    start() {
        this.bot = botMain(this.rest, this.routes, this.CLIENT_ID, this.TOKEN, this.client, this.commands);
    }

    restart() {
        this.stop();
        this.start();
    }

    stop() {
        if (this.bot) {
            this.bot = null;
        }
    }

    isReady() {
        return this.bot && this.bot.isReady;
    }

    isRunning() {
        if (this.bot) {
            return true;
        } else {
            return false;
        }
    }
}

class BotServer {
    constructor(internalCommands, botInstance) {
        this.botInstance = botInstance;
        this.internalCommands = internalCommands;
        this.server = http.createServer();
        this.io = socketIO(this.server);

        this.setupSocketEvents();
        this.isRunning = false;
    }

    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            for (const command of this.internalCommands) {
                // Client will emmit: "servercommand" as the event 
                // and the command name as the data
                socket.on('servercommand', (data) => {
                    if (data === command.name) {
                        command.execute(this);
                    }
                });
            }
        });
    }

    start() {
        const os = require('os');
        this.isRunning = true;
        console.log(`
    -------------------------------------------------
    | Server started on ${os.hostname()}
    | IPV6: ${(os.networkInterfaces().Ethernet && os.networkInterfaces().Ethernet[1] ? os.networkInterfaces().Ethernet[1].address : 'N/A')}
    | Port: ${process.env.PORT}
    -------------------------------------------------
    | Hostname: ${os.hostname()}
    | Platform: ${os.platform()}
    | Arch: ${os.arch()}
    | CPU: ${os.cpus().length > 0 ? os.cpus()[0].model : 'N/A'}
    | Cores: ${os.cpus().length}
    | Total Memory: ${os.totalmem() / 1024 / 1024 / 1024} GB
    | Free Memory: ${os.freemem() / 1024 / 1024 / 1024} GB
    | Uptime: ${os.uptime() / 60 / 60} hours
    -------------------------------------------------
    | Bot Status: ${this.botInstance.isRunning() ? 'Running' : 'Stopped'}
    | Server Status: ${this.isRunning ? 'Running' : 'Stopped'}
    -------------------------------------------------
    | Server commands:
    ${this.internalCommands.map(command => `| ${command.name} - ${command.description}`).join('\n')}
    -------------------------------------------------`)
        try{
            this.botInstance.start();
            this.server.listen(process.env.PORT, () => {
                console.log('Server started on port ' + process.env.PORT);
            });
        }
        catch(err){
            this.io.emit('error', err);
            console.log(err);
        }
    }

    stop() {
        this.isRunning = false;
        this.botInstance.stop();
        this.server.close(() => {
            console.log('Server stopped');
        });
    }

    status() {
        const os = require('os');

        let status = `\n
            | Bot Status: ${this.botInstance.isRunning() ? 'Running' : 'Stopped'}
            | CPU: ${os.cpus()[0].model}
            | Cores: ${os.cpus().length}
            | Total Memory: ${os.totalmem() / 1024 / 1024 / 1024} GB
            | Free Memory: ${os.freemem() / 1024 / 1024 / 1024} GB
            | Uptime: ${os.uptime() / 60 / 60} hours
        `
        this.io.emit('status', status);
    }

    help(){
        console.log('Help requested');
        let helpmessage = `
            | Server commands:
            ${this.internalCommands.map(command => `| ${command.name} - ${command.description}`).join('\n')}`
            this.io.emit('help', helpmessage);
    }

    restart() {
        this.stop();
        this.start();
    }

    killserver() {
        this.stop();
        process.exit(0);
    }
}

module.exports = { BotServer, BotInstance };