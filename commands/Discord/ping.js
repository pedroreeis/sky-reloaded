module.exports.run = async ({ client, message }) => {
    let botping = new Date() - message.createdAt;
    let pEmbed = new client.utils.embed()
        .addFields([
            { name: '🤖 BOT:', value: `\`${+ Math.floor(botping) + "ms"}\``, inline: true},
            { name: '📡 API:', value: `\`${+ Math.floor(client.ws.ping) + "ms"}\``, inline: true}
        ])
    message.reply({ embeds: [pEmbed]})
}

exports.help = {
    name: "ping",
    aliases: ['pong'],
    description: "Mostra o ping atual do bot",
    usage: 'ping'
};
