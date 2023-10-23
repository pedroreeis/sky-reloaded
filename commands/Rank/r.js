const { ActionRowBuilder, ButtonBuilder  } = require("discord.js");

module.exports.run = async ({ client, message, args }) => {
    try {
        let guild = client.guilds.cache.get(args[0]) || message.guild;

        client.utils.mysql.query(`SELECT * FROM users WHERE guild='${guild.id}' ORDER BY level,xp ASC;`, async (err, rowsAll) => {
            let top = [];
            rowsAll.forEach(row => {
                const id = row.ID
                const user = guild.members.cache.get(id)

                if (user) {
                    top.push(`{"user":"${row["ID"]}","xp":"${parseInt(row["xp"])}","level":"${parseInt(row["level"])}"}`);
                }
            });

            top.reverse();

            var servers = await top;
            var num = 0;
            var pagina = 1;
            var totalPages = parseInt(top.length / 5 + 1);

            const embed = {
                description: servers.slice(num, num + 5).map(se => {
                    const userTag = client.users.cache.get(JSON.parse(se)["user"]) ? client.users.cache.get(JSON.parse(se)["user"]).tag : 'Saiu do servidor';
                    const level = JSON.parse(se)["level"].toString();
                    const xp = JSON.parse(se)["xp"].toString();
                    return `\`${userTag}\`\n\`\`\`Nível: ${level}\nXP: ${xp}\`\`\``;
                }).join('\n'),
                footer: {
                    text: `Página ${pagina} de ${totalPages}`,
                    iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }),
                },
            };

            const buttonsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('backward')
                        .setLabel('⬅')
                        .setStyle(1),
                    new ButtonBuilder()
                        .setCustomId('forward')
                        .setLabel('➡')
                        .setStyle(1)
                );

            const rankMessage = await message.reply({ embeds: [embed], components: [buttonsRow] });

            const filter = (i) => (i.customId === 'backward' || i.customId === 'forward') && i.user.id === message.author.id;
            const collector = rankMessage.createMessageComponentCollector({ filter, time: 250000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'backward') {
                    if (pagina !== 1) {
                        num = num - 20;
                        num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0;
                        pagina -= 1;
                    } else {
                        pagina = totalPages;
                        num = (totalPages * 5) - 5;
                    }
                } else if (i.customId === 'forward') {
                    if (pagina !== totalPages) {
                        num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0;
                        num = num + 20;
                        pagina += 1;
                    } else {
                        pagina = 1;
                        num = 0;
                    }

                    embed.description = servers.slice(num, num + 5).map(se => {
                        const userTag = client.users.cache.get(JSON.parse(se)["user"]) ? client.users.cache.get(JSON.parse(se)["user"]).tag : 'Saiu do servidor';
                        const level = JSON.parse(se)["level"].toString();
                        const xp = JSON.parse(se)["xp"].toString();
                        return `\`${userTag}\`\n\`\`\`Nível: ${level}\nXP: ${xp}\`\`\``;
                    }).join('\n');

                    rankMessage.edit({ embeds: [embed] });
                }
                i.deferUpdate();
            });

            collector.on('end', () => {
                rankMessage.edit({ components: [] }).catch(console.error);
            });
        });
    } catch (e) {
        message.reply(`:x: ERRO:\`\`\`js\n${e.name}: ${e.message}\`\`\``);
    }
};
exports.help = {
	name: "r",
	aliases: ['top', 'trk'],
	description: "Mostra os top 10 no rank",
	usage: 'rank'
};


