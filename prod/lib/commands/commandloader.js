function commandloader(path, requirePath){
    const fs = require('fs');

    let commands = [];
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${requirePath}${file}`);
        commands.push(command);
    }
    return commands;
}

module.exports = commandloader;