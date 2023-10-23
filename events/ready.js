module.exports = async (client, message, args) => {

    client.utils.langs.en(client)
    client.utils.langs.pt(client)

    client.utils.reloadcmds(client)

    //client.user.setActivity(`Estou em ${client.guilds.cache.size.toLocaleString()} servidores!`);

    await client.user.setActivity('@Miyascream');

    client.utils.logs.red(`Fui iniciado com sucesso\nGuilds: ${client.guilds.cache.size.toLocaleString()}\nUsers: ${client.users.cache.size.toLocaleString()}\nEmojis ${client.emojis.cache.size.toLocaleString()}\nCanais: ${client.channels.cache.size.toLocaleString()}`)

    client.guilds.cache.map(async guild => {

        const rows = await client.utils.schema.guilds(guild.id)

        let sql;
        if (rows.length < 1) {
            sql = `INSERT INTO guilds (server, CHANNEL_IDMEMBERCOUNT, CHANNEL_IDWELCOME, CHANNEL_IDLEAVE, IDCARGOADD, CHANNEL_IDLOG, prefix, lang) VALUES ('${guild.id}','', '', '', '', '', '!', 'br')`;
            await client.utils.mysql.query(sql)
        }
    })
}