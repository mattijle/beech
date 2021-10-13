const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { updateGuildRoles, updateGuildInfoChannel } = require('../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Muuta botin palvelin kohtaisia asetuksia.')
        .addStringOption(option => option.setName('roolit').setDescription('Aseta botin tarjoamat roolit. (huom. ei luo uusia rooleja.)'))
        .addStringOption(option => option.setName('kanava').setDescription('Aseta botin käyttämä kanava')),
    async execute(interaction) {
        if (!interaction.memberPermissions.has('0x00000008', true)) {
            await interaction.reply({ content: 'Tarvitset admin oikeudet', ephemeral: true });
            return;
        }
        const optsRoles = interaction.options.getString('roolit');
        console.log(optsRoles);
        const optsChannels = interaction.options.getString('kanava');

        if (!optsRoles && !optsChannels) {
            await interaction.reply({ content: 'Mitään ei muutettu', ephemeral: true });
            return;
        }
        const guild = interaction.guild;
        let reply = '';
        if (optsRoles) {
            const channel = interaction.guild.channels.fetch(interaction.channelId);
            const roles = optsRoles.split(',');
            const guildroles = await guild.roles.fetch();
            const addedRoles = roles.reduce((prev, role) => {
                role = role.trim();
                gRole = guildroles.find((r => r.name === role));
                if (!gRole)
                    return prev;
                prev[role] = '';
                return prev;
            }, {});
            const information = await interaction.channel.send('Reagoi seuraaviin viesteihin haluamallasi emojilla.')
            setTimeout(() => {
                information.delete();
            }, 1000 * 60 * 3)
            Object.keys(addedRoles).map(async (role) => {

                const m = await interaction.channel.send(role);
                let reaction = await m.awaitReactions({ max: 1 });
                console.log(reaction.first()._emoji.name);
                addedRoles[role] = reaction.first()._emoji.name;
                updateGuildRoles(guild.name, addedRoles);
                setTimeout(() => {
                    m.delete();
                }, 1000 * 60 * 3)
            })

            updateGuildRoles(guild.name, addedRoles);
            reply += `Pyydettävät roolit: ${Object.keys(addedRoles).toString()}`
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
