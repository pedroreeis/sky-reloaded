const { MessageAttachment } = require('discord.js');

module.exports = {
    async memberJoin(client, member, rows, lang) {
        let logChannel = member.guild.channels.cache.find(channel => channel.id === `${rows[0].CHANNEL_IDWELCOME}`);
        if (logChannel) {
            var gg = new client.utils.embed()
            gg.setDescription(lang.events.memberJoin.replace("+member+", member.user.tag))
            logChannel.send({ embeds: [gg] }).catch(e => {
                client.utils.logs.good(`${e.name}: ${e.message}`)
            })
            client.utils.mysql.query(`SELECT * FROM users WHERE ID = '${member.id}' AND guild = '${member.guild.id}';`, async (err, rows) => {
                if (err) throw err;
                if (rows[0] != null) return;
                if (err) throw err;
                let sql;
                if (rows.length < 1) {
                    sql = `INSERT INTO users (ID, xp, level, guild, accessToken, background) VALUES ('${member.id}', '1', 1, '${member.guild.id}', '', '');`

                    if (err) throw err;
                    await client.utils.mysql.query(sql)
                }
            })
        }
    }
}

module.exports.leave = {
    async memberLeave(client, member, rows, lang) {
        let logChannel = member.guild.channels.cache.find(channel => channel.id === `${rows[0].CHANNEL_IDLEAVE}`);
        if (logChannel) {
            var gg = new client.utils.embed()
                .setDescription(lang.events.memberLeave.replace("+member+", member.user.tag))
            logChannel.send({ embeds: [gg] }).catch(e => {
                client.utils.logs.good(`${e.name}: ${e.message}`)
            })
        }
    }
}

module.exports.role = {
    roleAdd(client, member, rows) {
        let cargo = rows[0].IDCARGOADD;
        let roleAddUserJoin;
        if (!roleAddUserJoin > cargo) return 0;
        member.roles.add(member.guild.roles.cache.find(r => r.id === cargo)).catch(e => {
            if (e.message == "Supplied parameter was neither a Role nor a Snowflake.") {
                sql = `UPDATE guilds SET IDCARGOADD = '0' WHERE server = '${member.guild.id}'`;
                client.utils.mysql.query(sql)
            }
            if (e.message == "Missing Access") return 0;
            if (e.message == "Missing Permissions ") return 0;
        })
    }
}

//=============================================================================================================================================================================================================================//

module.exports.count = {
    async memberCount(client, member, rows, lang) {
        if (rows[0].CHANNEL_IDMEMBERCOUNT >= 1) {
            try {
                let guild = `${member.guild.memberCount - member.guild.members.cache.filter(m => m.user.bot).size}`.split("");
                let contadorGif = ['0', '<:UM:885158276407394344>', '<:DOIS:885158280240988222>', '<:TRES:885158275841159210>', '<:Quatro:885158276210262067>', '<:Cinco:885158276453511178>', '<:SEIS:885158276243795999>', '<:568470831462744084:885158275874709505>', '<:OITO:885158276126375946>', '<:NOVE:885158276352864256>']
                countGif = '';
                for (let i = 0; i < guild.length; i++) { countGif += '' + contadorGif[guild[i]] + ''; }
                await member.guild.channels.cache.get(rows[0].CHANNEL_IDMEMBERCOUNT).setTopic(lang.events.memberCount.replace("+length+", countGif))

            } catch (e) {
                if (e.message == "Cannot read property 'setTopic' of undefined") {
                    sql = `UPDATE guilds SET CHANNEL_IDMEMBERCOUNT = '0' WHERE server = '${member.guild.id}'`
                    client.utils.mysql.query(sql)
                }
                if (e.message == "Missing Access") return 0;
                if (e.message == "Missing Permissions ") return 0;
            }
        }
    }
}