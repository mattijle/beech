const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { getGuildInfoChannel, setGuildRoleMessage, getGuildRoles } = require('../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolemsg')
        .setDescription('Luo roolitus viestin.'),
    async execute(interaction) {
        if (!interaction.memberPermissions.has('0x00000008', true)) {
            await interaction.reply({ content: 'Tarvitset admin oikeudet', ephemeral: true });
            return;
        }
        const guild = interaction.guild;
        const channelId = getGuildInfoChannel(guild.name)
        const channel = channelId ? await guild.channels.fetch(channelId) : interaction.channel;
        const roles = await getGuildRoles(guild.name);
        const guildRoles = await guild.roles.fetch();
        let emojiRole = {};
        if (!roles) {
            interaction.reply({ content: 'Ei rooleja tarjolla. Lisää roolit "/set roolit" komennolla.', ephemeral: true });
            return;
        }
        await interaction.reply({ content: 'Luodaan roolitusviesti.', ephemeral: true });

        // Create RoleMessage.
        const roleNames = Object.keys(roles);

        const messageContent = roleNames.reduce((prev, role) => {
            let emoji = roles[role];
            emojiRole[emoji] = role;
            prev += `${emoji} - ${role}\n`
            return prev;
        }, 'Reagoi alla oleville emojeilla niin saat haluamasi roolin.\n');

        const msg = await channel.send(codeBlock(messageContent));
        setGuildRoleMessage(guild.name, msg.id);

        roleNames.map(role => msg.react(roles[role]));

        // Collect and handle reactions. This should perhaps be in it's own file. dunno.
        const filter = (r, u) => !u.bot;
        const collector = msg.createReactionCollector({ filter, dispose: true });

        collector.on('remove', async (r, u) => {
            const role = emojiRole[r.emoji.name];

            if (!role) return;

            const gRole = guildRoles.find((rl => rl.name === role));
            const userCollection = await guild.members.search({ query: u.username })
            const user = userCollection.get(u.id);
            try {
                await user.roles.remove(gRole);
            } catch (error) {
                console.log(error);
            }

        })
        collector.on('collect', async (r, u) => {
            const role = emojiRole[r.emoji.name];

            if (!role) return;

            const gRole = guildRoles.find((rl => rl.name === role));
            const userCollection = await guild.members.search({ query: u.username })
            const user = userCollection.get(u.id);
            try {
                user.roles.add(gRole);
            } catch (error) {
                console.log(error);
            }
        })

    },
};
