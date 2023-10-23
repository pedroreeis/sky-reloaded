module.exports = async (bot, message) => {

    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    bot.utils.vars.GiveRandomXP(bot, message)

    const rows = await bot.utils.schema.guilds(message.guild.id)
    if (rows[0] == null) return 0;

    const enus = JSON.parse(JSON.stringify(bot.utils.langs.en))
    const ptbr = JSON.parse(JSON.stringify(bot.utils.langs.pt))


    let lang = rows[0].lang

    switch (lang.toLowerCase()) {
        case 'br':
            lang = ptbr
            break;
        case 'en':
            lang = enus
            break;
        default:
            lang = enus
            break;
    }

    const prefix = await rows[0].prefix;

    if (message.content.startsWith(`reloadcmds`)) {
        if (!bot.devs.includes(message.author.id)) return;
        const ggwp = await bot.utils.reloadcmds(bot)
        message.reply({
            embeds: [new bot.utils.embed(message.author).setDescription(ggwp)]
        })
    }

    if (message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)) {
        message.reply({
            embeds: [new bot.utils.embed().setDescription(lang.events.menctionObito.replace("+prefixo+", prefix).replace("+prefix+", prefix).replace("+user+", message.author))]
        }).catch(() => { })
    }

    let client = message.client;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.split(" ")[0].toLowerCase().slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    let cmd;

    const channel = message.channel;

    async function checkUser(i) {
        const u = client.users.fetch(i).catch((e) => {
            return message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author;
        })
        return u;
    }

    const author = await checkUser(args[0]);

    client.utils.logs.red(`${message.author.tag}: ${message.content}`)

    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        if (message.channel.type === "dm" && cmd.conf.guildOnly) return message.reply("Este comando só pode ser usado em servidores!");
        cmd.run({ client, message, args, prefix, channel, author, lang })
    }
}