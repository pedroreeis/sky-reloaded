const { ActionRowBuilder, ButtonBuilder  } = require("discord.js");

exports.run = ({ client, message }) => {

  try {
    var num = 0;

    const emojis = client.emojis.cache;
    const emojisArray = emojis.map((emoji) => emoji.toString());
    const emojisLength = emojisArray.length;

    if (emojisLength === 0) {
        return message.reply('Não há emojis disponíveis neste servidor 😕');
    }

    const pageSize = 25;
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
            name: `${emojisLength} emojis`,
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
        const collector = ser.createMessageComponentCollector({ filter, time: 250000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'backward') {
                if (page > 1) {
                    num = num - 25;
                    num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0;
                    page--;
                } else {
                    page = totalPages;
                    num = (totalPages * 25) - 25;
                }
            } else if (i.customId === 'forward') {
                if (page < totalPages) {
                    num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0;
                    num = num + 25;
                    page++;
                } else {
                    page = 1;
                    num = 0;
                }

            const newEmojiArray = emojisArray.slice((page - 1) * pageSize, page * pageSize);

            const newEmbed = {
                description: newEmojiArray.join(' | '),
                footer: {
                    text: `Página ${page} de ${totalPages}`,
                    iconURL: message.author.displayAvatarURL(),
                },
                author: {
                    name: `${emojisLength} emojis`,
                },
            };

            ser.edit({ embeds: [newEmbed] });
            i.deferUpdate();
        }
      });
    })
  } catch (e) {
    message.reply(`:x: ERRO:\`\`\`js\n${e.name}: ${e.message}\`\`\``)
  }
}
exports.help = {
  name: 'emojisall',
  aliases: ['emoticonsall'],
  description: 'Veja todos os emojis de todos servidores que eu estou',
  usage: 'emojisall'
};
