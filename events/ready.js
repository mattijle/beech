const { register } = require('../deploy-commands');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`logged in as ${client.user.tag}`)
		const guilds = await client.guilds.fetch()
		guilds.each(guild => register(guild.id))
	}
}


