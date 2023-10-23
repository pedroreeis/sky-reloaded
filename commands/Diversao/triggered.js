module.exports.run = async ({ client, message, channel, args }) => {

    let carter = message.mentions.users.first() || client.users.cache.get(args[0]);
	let url = carter ? carter.displayAvatarURL({ extension: "png" }) : await client.utils.imgDetect(message, args)

	 
   	 const tr = await client.utils.canvas.triggered(url)
     channel.send({ files: [new client.utils.attach(tr, 'tr.gif')]})
}

exports.help = {
    name: "triggered",
    aliases: ['tr', 'rage'],
    description: "Sabe quando alguém está irritado? Então, crie uma imagem de alguém triggered!",
    usage: 'triggered [@uchiha obito]'
};
