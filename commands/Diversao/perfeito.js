module.exports.run = async ({client, message, args, channel}) => {

	 let carter = message.mentions.users.first() || client.users.cache.get(args[0]);
	 let url = carter ? carter.displayAvatarURL({ extension: "png" }) : await client.utils.imgDetect(message, args)
	 //let url = carter ? "https://cdn.discordapp.com/avatars/" + carter.id + "/" > + carter.avatar + ".png" :  await client.utils.imgDetect(message, args)
	 
   	 const perfeito = await client.utils.canvas.perfeito(url)
     await channel.send({ 
		files: [new client.utils.attach(perfeito, 'perfeito.png')]
	})
}
exports.help = {
	name: "perfeito",
	aliases: ['excelente'],
	description: "Mostre para as pessoas o que realmente é perfeito!",
	usage: 'perfeito [@user]'
};
