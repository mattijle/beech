const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { register } = require('./deploy-commands');
const { token } = require('./config.json');


const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    console.log(`logged in as ${client.user.tag}`)
    //await register();
    const guilds = await client.guilds.fetch()
    guilds.each(guild => register(guild.id))
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        await interaction.reply({ content: 'Jotain meni pieleen.', ephemeral: true })
    }
})

client.login(token)