var moment = require('moment');
moment.locale('pt-BR');

module.exports.run = async ({ client, message, prefix, channel, lang }) => {

    const emoji = (id) => client.emojis.cache.find((r) => r.id == id);

    const gazz = 10 + prefix.length;

    const code = message.content.slice(gazz).replace(/<a?:.+:([0-9]+)>/g, '$1')
    const emojiResult = await emoji(code);

    if (!emojiResult) return channel.send(lang.emojiinfo.notfound)

    const sn = {
        true: "sim",
        false: "Não"
    }

    let embed = new client.utils.embed(message.author)
        .setAuthor(lang.emojiinfo.info, emojiResult.url)
        .addFields([
            { name: lang.emojiinfo.animated, value: sn[emojiResult.animated], inline: true },
            { name: lang.emojiinfo.created, value: moment(emojiResult.createdAt).format('LL'), inline: true },
            { name: lang.emojiinfo.id, value: emojiResult.id, inline: true },
            { name: lang.emojiinfo.name, value: emojiResult.name, inline: true },
            { name: lang.emojiinfo.server, value: emojiResult.guild, inline: true },
            { name: lang.emojiinfo.ident, value: `\`${emojiResult}\``, inline: true },
            { name: lang.emojiinfo.ident.url, value: lang.emojiinfo.url.replace("+url+", emojiResult.url), inline: true }
        ])
        .setThumbnail(emojiResult.url)
    channel.send({ embeds: [embed]})
}


exports.help = {
    name: "emojiinfo",
    aliases: ['infoemoji'],
    description: "Mostra informações do emoji",
    usage: "emojiinfo"
};
