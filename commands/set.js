const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { updateGuildRoles, updateGuildInfoChannel } = require('../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Muuta botin palvelin kohtaisia asetuksia.')
        .addStringOption(option => option.setName('roolit').setDescription('Aseta botin tarjoamat roolit. (huom. ei luo uusia rooleja.)'))
        .addStringOption(option => option.setName('kanava').setDescription('Aseta botin käyttämä kanava')),
    //.addStringOption(option => option.setName('kanava').setDescription('Kanava joilla haluat botin viestivän.'))
    async execute(interaction) {
        if (!interaction.memberPermissions.has('0x00000008', true)) {
            await interaction.reply({ content: 'Tarvitset admin oikeudet', ephemeral: true });
            return;
        }
        const optsRoles = interaction.options.getString('roolit')

        const optsChannels = interaction.options.getString('kanava');

        if (!optsRoles && !optsChannels) {
            await interaction.reply({ content: 'Mitään ei muutettu', ephemeral: true });
            return;
        }
        const guild = interaction.guild;
        let reply = '';
        if (optsRoles) {
            const roles = optsRoles.split(',').trim();
            const guildroles = await guild.roles.fetch();
            const addedRoles = roles.reduce((prev, role) => {
                gRole = guildroles.find((r => r.name === role));
                if (!gRole)
                    return prev;
                prev.push(role);
                return prev;
            }, []);
            updateGuildRoles(guild.name, addedRoles);
            reply += `Pyydettävät roolit: ${addedRoles.toString()}`
        }
        if (optsChannels) {
            const channelId = optsChannels.replace(/<|#|>/g, '')
            const channel = await guild.channels.fetch(channelId)
            updateGuildInfoChannel(guild.name, channelId);
            reply += `\n Uusi info kanava asetettu: #${channel.name}`
        }
        await interaction.reply({ content: codeBlock('js', reply), ephemeral: true });
    },
};
