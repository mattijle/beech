const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolemsg')
        .setDescription('Lue roolitus viestin.'),
    async execute(interaction) {

        const msg = await interaction.reply({ content: 'Reaktio testi!', fetchReply: true })
        msg.react('🍎').then(() => {
            const filter = () => true;
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
        })
    },
};
