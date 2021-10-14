const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { getGuildInfoChannel } = require('../db');


function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * Math.floor(max));
}

let noppa = new SlashCommandBuilder()
    .setName('noppa')
    .setDescription('Heitä noppaa');

noppa.addStringOption(option =>
    option.setName('nopat')
        .setDescription('mitä noppia haluat heittää, välilyönnillä eroteltuna, esim "3d6 4d4 2d8" ')

)

module.exports = {
    data: noppa,
    async execute(interaction) {
        const guild = interaction.guild;
        const channelId = getGuildInfoChannel(guild.name)
        const channel = channelId ? await guild.channels.fetch(channelId) : interaction.channel;
        const args = interaction.options.getString('nopat');
        var re = /[0-9]+[dD][0-9]+/;
        if (!args) { await interaction.reply({ content: 'Et valinnut noppia.', ephemeral: true }); return; }
        let rolls = args.toLowerCase().split(' ')
        const rolled = rolls.reduce((prev, roll) => {
            if (!re.test(roll))
                return prev;
            let dice = roll.split('d');
            if (parseInt(dice[1]) > 1000 || parseInt(dice[0]) > 1500)
                return prev;

            let result = 0;
            let results = [];
            for (let i = 0; i < parseInt(dice[0]); i++) {
                result = getRandomInt(parseInt(dice[1]))
                results.push(result);
            }
            prev[roll] = results.toString();
            return prev;
        }, {})
        const keys = Object.keys(rolled);
        let reply = ''
        for (key of keys) {
            reply += `${key}: ${rolled[key]}\n`

        }
        channel.send(codeBlock('js', reply))
        await interaction.reply({ content: codeBlock('js', reply), ephemeral: true });
    }
};
