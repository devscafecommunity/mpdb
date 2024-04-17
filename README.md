# mpdb
mpdb - código aberto.Multi.Purpose.Discord.Bot
O MPDB é uma base modular e robusta de código aberto para bots do Discord em JavaScript, utilizando o ápice do Clean Code, S.O.L.I.D e Design Patterns.

## Estrutura do Projeto

```
│   .env
│   .gitignore
│   index.js
│   package-lock.json
│   package.json
│   test.json
│   yarn-error.log
│   yarn.lock
│
├───commands
│       cafeuser.js
│       ping.js
│       reload.js
│       reposearch.js
│
├───events
│       start.js
│
├───lib
│   ├───commands
│   │       commandhandler.js
│   │       commandloader.js
│   │
│   ├───events
│   │       eventhandler.js
│   │       eventloader.js
│   │
│   ├───factoryes
│   │       clientFactory.js
│   │       discordRestFactory.js
│   │
│   ├───github
│   │       reposearch.js
│   │       test.json
│   │
│   └───main
│           botmain.js
│           index.html
│           osinfo.js
│
└───prisma
        schema.prisma
```

## Modelos de Eventos e Comandos

### Eventos

```javascript
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Conectado como ${client.user.tag}`);
    },
};
```

### Comandos

```javascript
module.exports = {
    name: 'ping',
    description: 'Ping...',
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
    options: [
        {
            name: 'item',
            description: 'Item a ser comprado',
            type: 3,
            required: true
        }
    ]
}
```

## Informações Adicionais

Adicione o modelo para eventos e comandos e forneça informações relevantes sobre eles. Certifique-se de seguir as práticas recomendadas para desenvolvimento de bot no Discord.
