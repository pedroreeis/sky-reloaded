module.exports.run = async ({ client, message, channel, args}) => {

    let usuario = message.mentions.members.first() || message.guild.members.cache.get(message.author.id);
    if(!usuario) return;

    let spotifyData = usuario.presence.activities
    
    if(spotifyData == "Spotify") {
    const spotifyInfo = usuario.presence.activities[0]
    const spotify = await client.utils.canvas.spotify({ spotifyInfo })
    channel.send({
        files: [new client.utils.attach(spotify, 'spotify.png')]
    })
    } else {
        message.reply('Não esta escutando spotify!')
    }
}


exports.help = {
    name: "spotify",
    aliases: ['sp'],
    description: "Mostra informações da musica tocada no spotify",
    usage: "spotify (@user)"
};
