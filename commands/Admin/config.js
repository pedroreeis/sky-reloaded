exports.run = async ({ client, message, args, prefix, lang }) => {

    const rows = await client.utils.schema.guilds(message.guild.id)

    const perm = client.devs.includes(message.author.id) || message.member.permissions.has("MANAGE_GUILD")

    if (!perm) return message.reply(`${message.author}, ${lang.config.perm}`)
    if (rows[0] == null) return message.reply('MySqL error.');

    const entrada = rows[0].CHANNEL_IDWELCOME;
    const saida = rows[0].CHANNEL_IDLEAVE;
    const log = rows[0].CHANNEL_IDLOG;
    const role = rows[0].IDCARGOADD;
    const contador = rows[0].CHANNEL_IDMEMBERCOUNT;

    let channel = message.mentions.channels.first() || client.channels.cache.get(args[1]);
    let sql;
    let cargo = message.mentions.roles.first() || client.guilds.cache.get(message.guild.id).roles.cache.get(args[1])
    const toMute = message.guild.members.cache.get(client.user.id)
    const rolePerm = message.member.roles.highest.position >= toMute.roles.highest.position

    let embed = new client.utils.embed(message.author)
    let embedConfig = new client.utils.embed(message.author)
    embed.setThumbnail(client.user.avatarURL())

    const flags = {
        "en": ":flag_us:",
        "br": ":flag_br:"
    }

    const emojis = {
        false: "<:desatived:1165409297509924864>",
        true: "<:atived:1165409294863310960> "
    }

    const rows_lang = rows[0].lang

    if (prefix) {
        embed.setDescription(lang.config.lang.replace("+lang+", flags[rows_lang]).replace("+prefix+", prefix))
        //embed.setDescription(`🔧 Prefix: (**${prefix}**) \`${prefix}config prefix\`\n🛠️ ${await client.utils.lang(lang, 'lang')} (**${lang} ${flags[lang]}**) \`${prefix}${await client.utils.lang(lang, 'configLang')}\``)
    }


    if (contador > false) {
        embed.addFields([{ name: `${emojis[contador > false]} - ${lang.config.contador}`, value: `<#${contador}> \`[${prefix}${lang.config.removeContador}]\``}])
    } else {
        embed.addFields([{name: `${emojis[contador > false]} - ${lang.config.contador}`, value: `\`${prefix}${lang.config.configContador}\``}])
    }
    if (entrada > false) {
        embed.addFields([{name: `${emojis[entrada > false]} - ${lang.config.entrada}`, value: `<#${entrada}> \`[${prefix}${lang.config.configentradaRemove}]\``}])
    } else {
        embed.addFields([{name: `${emojis[entrada > false]} - ${lang.config.entrada}`, value: `\`${prefix}${lang.config.configEntrada}}\``}])
    }

    if (saida > false) {
        embed.addFields([{name: `${emojis[saida > false]} - ${lang.config.saida}`, value: `<#${saida}> \`[${prefix}${lang.config.configSaidaRemove}]\``}])
    } else {
        embed.addFields([{name: `${emojis[saida > false]} - ${lang.config.saida}`, value: `\`${prefix}${lang.config.leaveMsg}\``}])
    }
    if (log > false) {
        embed.addFields([{name: `${emojis[log > false]} - ${lang.config.logEmbed}`, value: `<#${log}> \`[${prefix}${lang.config.configRemoveLog}\``}])
    } else {
        embed.addFields([{name: `${emojis[log > false]} - ${lang.config.logEmbed}`, value: `\`[${prefix}${lang.config.configLog}]\``}])
    }
    if (role > false) {
        embed.addFields([{name: `${emojis[role > false]} - ${lang.config.roleEmbed}`, value: `<@&${role}> \`[${prefix}${lang.config.configRemoveAutorole}]\``}])
    } else {
        embed.addFields([{name: `${emojis[role > false]} - ${lang.config.roleEmbed}`, value: `\`[${prefix}${lang.config.configAutorole}]\``}])
    }
    if (!args[0]) return message.reply({ embeds: [embed] });

    if (args[0] == "contador" || args[0] == "member-count" || args[0] == "count") {
        if (!channel) return message.reply(lang.config.invalidChannel);
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.topico}: ${channel}`)
        sql = `UPDATE guilds SET CHANNEL_IDMEMBERCOUNT = '${channel.id}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "linguagem" || args[0] == "language" || args[0] == "lang") {

        if (args[1] != 'br' && args[1] != 'en') return message.reply({ embeds: [new client.utils.embed().setDescription(`${lang.config.langInvalid} \`br | en\``)] })

        embedConfig.setDescription(`${emojis['true']} - ${lang.config.langChange} (**${flags[args[1]]}  ${args[1]}**)`)
        sql = `UPDATE guilds SET lang = '${args[1]}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "prefix" || args[0] == "prefixo") {
        if (!args[1]) return message.reply(lang.config.prefix)
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.prefixChange} \`${args[1]}\``)
        sql = `UPDATE guilds SET prefix = '${args[1]}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "log" || args[0] == "logs") {
        if (!channel) return message.reply(lang.config.invalidChannel);
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.channelSend}: ${channel}`)
        sql = `UPDATE guilds SET CHANNEL_IDLOG = '${channel.id}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "cargo" || args[0] == "role") {
        if (!cargo) return message.reply(lang.config.invalidRole);
        //if (rolePerm) return message.reply('Esse membro tem um cargo maior que o meu.')
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.autorole} ${cargo}`)
        sql = `UPDATE guilds SET IDCARGOADD = '${cargo.id}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "entrada" || args[0] == "wellcome" || args[0] == "entry") {
        if (!channel) return message.reply(lang.config.invalidChannel);
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.welcome} ${channel}`)
        sql = `UPDATE guilds SET CHANNEL_IDWELCOME = '${channel.id}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "saida" || args[0] == "leave") {
        if (!channel) return message.reply(lang.config.invalidChannel);
        embedConfig.setDescription(`${emojis['true']} - ${lang.config.leave} ${channel}`)
        sql = `UPDATE guilds SET CHANNEL_IDLEAVE = '${channel.id}' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "remove-entrada" || args[0] == "remove-wellcome" || args[0] == "remove-boasvindas" || args[0] == "remove-entry") {
        embedConfig.setDescription(`${emojis['false']} - ${lang.config.memberMsgJoin} (<#${entrada}>)`)
        sql = `UPDATE guilds SET CHANNEL_IDWELCOME = '0' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "remove-saida" || args[0] == "remove-leave") {
        embedConfig.setDescription(`${emojis['false']} - ${lang.config.memberMsgLeave} (<#${saida}>)`)
        sql = `UPDATE guilds SET CHANNEL_IDLEAVE = '0' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "remove-autorole" || args[0] == "remove-cargo" || args[0] == "remove-role" || args[0] == "remove-roleadd") {
        embedConfig.setDescription(`${emojis['false']} - <@&${role}> ${lang.config.role}`)
        sql = `UPDATE guilds SET IDCARGOADD = '0' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "remove-log" || args[0] == "remover-log" || args[0] == "log-off") {
        embedConfig.setDescription(`${emojis['false']} - ${lang.config.log} (<#${entrada}>)`)
        sql = `UPDATE guilds SET CHANNEL_IDLOG = '0' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
    }
    //=================================
    if (args[0] == "remove-contador" || args[0] == "remove-member-count" || args[0] == "remove-count" || args[0] == "remove-counter") {
        embedConfig.setDescription(`${emojis['false']} - ${lang.config.topicCount} (<#${contador}>)`)
        sql = `UPDATE guilds SET CHANNEL_IDMEMBERCOUNT = '0' WHERE server = '${message.guild.id}'`;
        client.utils.mysql.query(sql)
        try {
            await message.guild.channels.cache.get(`${contador}`).setTopic('')
        } catch (e) {
            console.log(`${message.guild.name}\n${e.name}: ${e.message}`)
        }
    }
    message.reply({ embeds: [embedConfig] });
}
exports.help = {
    name: "config",
    aliases: ['configurar', 'c'],
    description: "Shows the bot settings for your server",
    usage: 'config'
};
