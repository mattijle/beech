const { register } = require('../deploy-commands');
const { roleMessageId, infoChannelId } = require('../config.json');
const { Collector } = require('discord.js');
const { ConnectableObservable } = require('rxjs');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`logged in as ${client.user.tag}`)

		// Submit the slash commands to guilds
		const guilds = await client.guilds.fetch()
		guilds.each(guild => register(guild.id))

		// Tämä ratkaisu ei toimi jos botti on useammalla palvelimella. 
		// Eikä tarjoa mahdollisuutta vaihtaa kanavaa botin ollessa käynnissä.

		if (!infoChannelId) return
		const infoChannel = await client.channels.fetch(infoChannelId)
		if (!infoChannel) return
		infoChannel.messages.fetch(roleMessageId)
			.then(msg => {
				const filter = (reaction) => {
					return ['😄', '\:smile:',].includes(reaction.emoji.name)
				}

				const reactionCollector = msg.createReactionCollector({ filter, dispose: true })

				reactionCollector.on('collect', (reaction, user) => {
					console.log(`Reaction user: ${user} didsomething? emoji:${reaction.emoji.name}`)
				})
				reactionCollector.on('create', (reaction, user) => {
					console.log(`Reaction user: ${user} created emoji:${reaction.emoji.name}`)
				})
				reactionCollector.on('remove', (reaction, user) => {
					console.log(`Reaction user: ${user} removed the emoji:${reaction.emoji.name}`)
				})
				reactionCollector.on('dispose', (reaction, user) => {
					console.log(`Reaction user: ${user} disposed the emoji:${reaction.emoji.name}`)
				})
			})
	}
}


