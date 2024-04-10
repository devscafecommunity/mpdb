/*

api: <apiuri>/api/public/user/data/<devid>

return:
{
  "devid": "lyeezinhoo",
  "regdate": "2024-04-05T15:33:48.261Z",
  "nickname": "Pedro Jesus",
  "verified": true,
  "bio": "Adm Apenas!",
  "location": "",
  "github": "https://github.com/LyeZinho",
  "twitter": "https://twitter.com/Je1Pedro",
  "website": "https://pedrokalebdev.pt/",
  "userstatus": "Cafe Enjoyer",
  "avatarurl": "https://cdn.discordapp.com/avatars/524622388629995541/d9f8ddc3b04ccd84a5a157451f3858bc.png",
  "banned": false,
  "admin": true,
  "createdAt": "2024-04-05T15:33:48.258Z",
  "updatedAt": "2024-04-08T11:10:39.722Z"
}
*/

async function getUserData(devid, callback){
    return new Promise((resolve, reject) => {
        const res = fetch(`${process.env.API}/api/public/user/data/${devid}`)
        .then(res => res.json())
        .then(json => {
            resolve(json);
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

/*

function gitMessageReply(data){
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
        .setTitle('GitHub Repository Search')
        .setDescription(`Total results: ${data.total_count}`)
        .setColor('#0099ff')
        .setTimestamp()
        // Dinamically add fields in 
        // (method) EmbedBuilder.setFields(...fields: RestOrArray<APIEmbedField>): EmbedBuilder
        embed.setFields(data.items.map((item, index) => {
            return {
                // [discordjs](https://github.com/discordjs/discord.js)
                name: `#${index + 1} ${item.name}`,
                value: `${item.description}\n 🌟 ${item.stargazers_count} | 🔗 ${item.forks_count} | 📝 ${item.open_issues_count} | 👁 ${item.watchers_count} | 🌎 ${item.language}\n
                [View Repo](${item.html_url})`,
                inline: false
            }
        }));
    return embed;
}


module.exports = {
    name: 'reposearch',
    description: 'Search for a repository on GitHub by name or github deep search query.',
    async execute(interaction) {
        const reposearch = require('../lib/github/reposearch.js');
        const query = interaction.options.getString('query');
        const result = await reposearch(query);
        const embed = gitMessageReply(result);
        await interaction.reply({ embeds: [embed] });
    },
    options: [
        {
            name: 'query',
            description: 'Query to search for repositories.',
            type: 3,
            required: true
        }
    ]
}

*/


/*
{
  "devid": "lyeezinhoo",
  "regdate": "2024-04-05T15:33:48.261Z",
  "nickname": "Pedro Jesus",
  "verified": true,
  "bio": "Adm Apenas!",  <- If empty show "No bio available."
  "location": "", <- If empty show "No location available."
  "github": "https://github.com/LyeZinho", <- If empty show "🐙⁉"
  "twitter": "https://twitter.com/Je1Pedro", <- If empty show "🐦⁉"
  "website": "https://pedrokalebdev.pt/", <- If empty show "🌐⁉"
  "userstatus": "Cafe Enjoyer", <- If empty show "No status available."
  "avatarurl": "https://cdn.discordapp.com/avatars/524622388629995541/d9f8ddc3b04ccd84a5a157451f3858bc.png",
  "banned": false, <- If true show "🚫" and "Banned" else show "✅"
  "admin": true, <- If true show "🛡" and "Admin" else show "👤"
  "createdAt": "2024-04-05T15:33:48.258Z",
  "updatedAt": "2024-04-08T11:10:39.722Z"
}
*/

function formatGithu(data){
    const username = data.github.split('/')[3]
    return `[github/${username}](${data.github})`;
}

function formatTwitter(data){
    const username = data.twitter.split('/')[3]
    return `[twitter/${username}](${data.twitter})`;
}

function formatWebsite(data){
    return `[website](${data.website})`;
}

function userMessageReply(data){
    const { EmbedBuilder } = require('discord.js');
    
    // Add fields dinamically
    let fieldsdata = [
        {name: 'Bio', value: data.bio ? data.bio : 'No bio available.', inline: false},
        {name: 'Location', value: data.location ? data.location : 'No location available.', inline: false},
        {name: 'User Status', value: data.userstatus ? data.userstatus : 'No status available.', inline: false},
        {name: 'Status', value: data.banned ? '🚫 Banned' : '✅ Active', inline: false},
        {name: 'GitHub', value: data.github ? formatGithu(data) : '🐙⁉', inline: true},
        {name: 'Twitter', value: data.twitter ? formatTwitter(data) : '🐦⁉', inline: true},
        {name: 'Website', value: data.website ? formatWebsite(data) : '🌐⁉', inline: true}
    ]

    const embed = new EmbedBuilder()
        .setTitle('Dev´s Café User Data')
        .setDescription(`### **${data.nickname}**
        #**${data.devid}**

        ${data.verified ? '✅ Verifyed User ' : ''} ${data.admin ? ' 🛡 Admin' : '👤'}`)
        .setColor('#0099ff')
        .setTimestamp()
        .setThumbnail(data.avatarurl)
        .addFields(
            fieldsdata.map((field) => {
                return {
                    name: field.name,
                    value: field.value,
                    inline: field.inline
                }
            })
        );
    return embed;
}


module.exports = {
    name: 'cafeuser',
    description: 'Procure por uma conta de utilizador do Dev´s Café.',
    async execute(interaction) {
        const devid = interaction.options.getString('devid');
        const result = await getUserData(devid);
        const embed = userMessageReply(result);
        await interaction.reply({ embeds: [embed] });
    },
    options: [
        {
            name: 'devid',
            description: 'Insira o devid do utilizador que deseja ver os dados.',
            type: 3,
            required: true
        }
    ]
}