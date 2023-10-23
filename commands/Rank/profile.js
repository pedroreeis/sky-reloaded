module.exports.run = async ({ client, channel, message, author }) => {
	
	const rank = await client.utils.canvas.profile({ author, message })
	channel.send({ files: [new client.utils.attach(rank, 'perfil.png')] })
}


exports.help = {
	name: "profile",
	aliases: ['prof', 'perfil'],
	description: "mostra perfil de um membro",
	usage: 'perfil [@membro]'
};



