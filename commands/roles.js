const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { ReactionCollector } = require('discord.js');
const { getGuildRoles } = require('../db')

const addRoles = async (interaction) => {
    let add = interaction.options.getString('roolit');
    const user = interaction.member;
    const guild = interaction.guild;
    const guildRoles = await guild.roles.fetch();
    const availableRoles = getGuildRoles(guild.name);
    if (!guildRoles || !availableRoles) {
        await interaction.reply({ content: 'Rooleja ei ole tarjolla.', ephemeral: true });
        return;
    }
    if (add) {
        add = add.split(',');
        add.map(role => {
            role = role.trim();
            const idx = Object.keys(availableRoles).findIndex(r => r === role)
            if (idx < 0)
                return;
            const gRole = guildRoles.find((r => r.name === role));
            user.roles.add(gRole);
            return;
        })
    }
    await interaction.reply({ content: 'Roolituspyyntö toteutettu.', ephemeral: true });
}
const removeRoles = async (interaction) => {
    let remove = interaction.options.getString('roolit');
    const user = interaction.member;
    const guild = interaction.guild;
    const guildRoles = await guild.roles.fetch();
    const availableRoles = getGuildRoles(guild.name);
    console.log(interaction.commandName);
    if (!guildRoles || !availableRoles) {
        await interaction.reply({ content: 'Rooleja ei ole tarjolla.', ephemeral: true });
        return;
    }
    if (remove) {
        remove = remove.split(',');
        remove.map(role => {
            role = role.trim();
            const idx = Object.keys(availableRoles).findIndex(r => r === role)
            if (idx < 0)
                return;
            const gRole = guildRoles.find((r => r.name === role));
            user.roles.remove(gRole);
            return;
        })
    }
    await interaction.reply({ content: 'Roolituspyyntö toteutettu.', ephemeral: true });
    return;
}
const listRoles = async (interaction) => {
    const guild = interaction.guild;
    const guildRoles = await guild.roles.fetch();
    const availableRoles = getGuildRoles(guild.name);
    console.log(interaction.commandName);
    if (!availableRoles) {
        await interaction.reply({ content: 'Rooleja ei ole tarjolla.', ephemeral: true });
        return;
    }
    const reply = codeBlock(`Tarjolla olevat roolit: ${availableRoles.toString()}`)
    await interaction.reply({ content: reply, ephemeral: true });
    return;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Pyydä rooleja.')
        .addSubcommand(sub => sub.setName('poista').setDescription('Poista itseltäsi rooleja').addStringOption(option => option.setName('roolit').setDescription('Syötä haluamasi roolit pilkulla eroteltuina. esim. Rool1,  Rooli2')))
        .addSubcommand(sub => sub.setName('lisää').setDescription('Lisää itsellesi rooleja').addStringOption(option => option.setName('roolit').setDescription('Syötä haluamasi roolit pilkulla eroteltuina. esim. Rool1,  Rooli2')))
        .addSubcommand(sub => sub.setName('lista').setDescription('Listaa tarjolla olevat roolit')),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand()
        if (sub === 'lista') {
            listRoles(interaction);
            return;
        }
        if (sub === 'lisää') {
            addRoles(interaction);
            return
        }
        if (sub === 'poista') {
            removeRoles(interaction);
            return
        }
        await interaction.reply({ content: 'Jos näet tämän on jotain mennyt pieleen.', ephemeral: true });
    }
};
