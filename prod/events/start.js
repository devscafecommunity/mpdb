// On start event
/*

Eventloader:


function eventloader(path, requirePath){
    const fs = require('fs');

    let events = [];
    const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`${requirePath}${file}`);
        events.push(event);
    }
    return events;
}

module.exports = eventloader;

Event handler:

function eventHandler(clientObject, events){
    for (const event of events) {
        if(event.once) {
            clientObject.once(event.name, (...args) => event.execute(...args, clientObject));
        } else {
            clientObject.on(event.name, (...args) => event.execute(...args, clientObject));
        }
    }
}

module.exports = eventHandler;

*/


// On start show the bot is online on the console


module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
    },
};