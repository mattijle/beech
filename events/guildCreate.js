const { register } = require("../deploy-commands")

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        await register(guild.id);

    },
}