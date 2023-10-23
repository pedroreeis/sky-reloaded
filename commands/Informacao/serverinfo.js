
module.exports.run = async ({ client, message, args }) => {

    const moment = require('moment'); moment.locale("pt-BR")

    let guild = client.guilds.cache.get(args[0]) || message.guild;
    let iconSplash = guild.iconURL() ? guild.splashURL({ format: 'png', size: 1024 }) : ''

    let bots = guild.members.cache.filter(m => m.user.bot).size;
    let humans = guild.members.cache.filter(m => !m.user.bot).size;

    let text = guild.channels.cache.filter(m => m.type == "text").size;
    let voice = guild.channels.cache.filter(i => i.type == "voice").size;

    let membro = guild.members.cache.get(client.user.id); // message.author

    const entrouNoServer = moment(membro.joinedTimestamp).format('L');
    const guildcreate = moment(guild.createdAt).format('L');

    /*let online = guild.members.cache.filter(a => a.presence.status == "online");
    let offline = guild.members.cache.filter(a => a.presence.status == "offline");

    let ocupado = guild.members.cache.filter(a => a.presence.status == "dnd");
    let ausente = guild.members.cache.filter(a => a.presence.status == "idle");*/

    let embed = new client.utils.embed(message.author);
    embed.setThumbnail(guild.iconURL({ format: 'png', dynamic: true, size: 2048 }));


    //embed.setDescription(`<:Online:568464325363367956> Online: \`${online.size}\` - <:Offline:568464325350653968> Offline: \`${offline.size}\` - <:ocupado:717379117237928017> Ocupado: \`${ocupado.size}\` - <:ausente:717379869721231421> Ausente: \`${ausente.size}\` `)

    embed.addFields([
        { name: '🌐 Server:', value: `\`${guild.name}\``, inline: false },
        { name: '🆔', value: `\`${guild.id}\``, inline: false },

        { name: '👥 Users:', value: `\`${guild.memberCount.toLocaleString()}\``, inline: false },

        { name: '🤖 Bots:', value: `\`${bots.toLocaleString()}\``, inline: false },
        { name: '🤷 Humans:', value: `\`${humans.toLocaleString()}\``, inline: false },

        { name: '💬 Text:', value: `\`${text.toLocaleString()}\``, inline: false },
        { name: '🔊 Voice:', value: `\`${voice.toLocaleString()}\``, inline: false },

        { name: '📌 Cargos:', value: `\`${guild.roles.cache.size.toLocaleString()}\``, inline: false },
        { name: '🛒 Emojis:', value: `\`${guild.emojis.cache.size.toLocaleString()}\``, inline: false },

        { name: '📅 Criado em:', value: `\`${guildcreate}\``, inline: false },
        { name: '📅 Entrou em:', value: `\`${entrouNoServer}\``, inline: false },
    ])

    embed.setImage(iconSplash);
    message.reply({ embeds: [embed]})

}

module.exports.help = {
    name: "serverinfo",
    aliases: ['guildinfo', 'si'],
    description: "Mostra informações do servidor",
    usage: 'userinfo'
}
