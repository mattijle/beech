const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { getGuildInfoChannel, updateGuildRoleMessage, getGuildRoles } = require('../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolemsg')
        .setDescription('Lue roolitus viestin.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const channel = await guild.channels.fetch(getGuildInfoChannel(guild.name)) || interaction.channel;
        const roles = await getGuildRoles(guild.name);
        if (!roles) {
            interaction.reply({ content: 'Ei rooleja tarjolla.', ephemeral: true });
            return;
        }
        await interaction.reply({ content: 'Luodaan roolitusviesti.', ephemeral: true });
        const roleNames = Object.keys(roles);
        const messageContent = roleNames.reduce((prev, role) => {
            prev += `${roles[role]} - ${role}\n`
            return prev;
        }, 'Reagoi alla oleville emojeilla niin saat haluamasi roolin.\n');

        const msg = await channel.send(codeBlock(messageContent));
        updateGuildRoleMessage(guild.name, msg.id);
        roleNames.map(role => msg.react(roles[role]));

        const filter = (r, u) => !u.bot;
        const collector = msg.createReactionCollector({ filter, dispose: true });
        collector.on('remove', (r, u) => {
            console.log('removed', r.emoji.name, u.username)
        })
        collector.on('create', (r, u) => {
            console.log(r.emoji.name, u.username);
        })
        collector.on('collect', (r, u) => {
            console.log(r.emoji.name, u.username);
        })

    },
};
