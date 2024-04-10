/*
async function main(){
    try {
        console.log('Started aplication (/) commands cache.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
            .then(() => console.log('Successfully deleted all application commands.'))
            .catch(console.error);

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
*/ 

async function main( restInstance, routesInstance, clientId, token, clientInstance, commands ){
    try {
        console.log('Started refreshing application (/) commands.');

        await restInstance.put( routesInstance.applicationCommands(clientId), { body: commands })
            .then(() => console.log('Successfully reloaded application (/) commands.'))
            .catch(console.error);

        clientInstance.login(token);
    } catch (error) {
        console.error(error);
    }
}

module.exports = main;