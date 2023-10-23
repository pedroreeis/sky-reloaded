const { ActionRowBuilder, ButtonBuilder  } = require("discord.js");
exports.run = ({ client, message, args }) => {
    try {
        const guild = client.guilds.cache.get(args[0]) || message.guild;

        const emojis = guild.emojis.cache;
        const emojisArray = emojis.map((emoji) => emoji.toString());
        const emojisLength = emojisArray.length;

        if (emojisLength === 0) {
            return message.reply(`Este servidor não parece ter emojis 😕`);
        }

        const pageSize = 20;
        let page = 1;
        const totalPages = Math.ceil(emojisLength / pageSize);

        const emojiArray = emojisArray.slice((page - 1) * pageSize, page * pageSize);

        const embed = {
            description: emojiArray.join(' | '),
            footer: {
                text: `Página ${page} de ${totalPages}`,
                iconURL: message.author.displayAvatarURL(),
            },
            author: {
                name: `${emojisLength} emojis, ${guild.name}`,
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

        message.reply({ embeds: [embed], components: [buttonsRow] }).then(async (ser) => {
            const filter = (i) => (i.customId === 'backward' || i.customId === 'forward') && i.user.id === message.author.id;
            const collector = ser.createMessageComponentCollector({ filter, time: 200000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'backward') {
                    if (page > 1) {
                        page--;
                    } else {
                        page = totalPages;
                    }
                } else if (i.customId === 'forward') {
                    if (page < totalPages) {
                        page++;
                    } else {
                        page = 1;
                    }
                }

                const newEmojiArray = emojisArray.slice((page - 1) * pageSize, page * pageSize);

                const newEmbed = {
                    description: newEmojiArray.join(' | '),
                    footer: {
                        text: `Página ${page} de ${totalPages}`,
                        iconURL: message.author.displayAvatarURL(),
                    },
                    author: {
                        name: `${emojisLength} emojis, ${guild.name}`,
                    },
                };

                ser.edit({ embeds: [newEmbed] });
                i.deferUpdate();
            });
        });
    } catch (e) {
        message.reply(`:x: ERRO:\`\`\`js\n${e.name}: ${e.message}\`\`\``);
    }
};
exports.help = {
    name: 'emojis',
    aliases: ['emoticons'],
    description: 'Veja todos os emojis que um servidor possuí!',
    usage: 'emojis'
};