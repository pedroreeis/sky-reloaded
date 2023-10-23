const { ActionRowBuilder, ButtonBuilder  } = require("discord.js");

module.exports.run = async ({ client, message, args }) => {
    if (!client.devs.includes(message.author.id)) return;

    const servers = client.guilds.cache;
    let num = 0;
    let pagina = 1;
    const totalPages = Math.ceil(servers.size / 10);

    const embed = {
        description: servers.map(se => `Nome: \`${se.name}\` - ID: \`${se.id}\` Users: \`${se.memberCount}\``).slice(0, 10).join('\n'),
        footer: {
            text: `Página ${pagina} de ${totalPages}`,
            iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }),
        },
        author: {
            name: `${client.guilds.cache.size} servers`,
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

    const serverMessage = await message.reply({ embeds: [embed], components: [buttonsRow] });

    const filter = (i) => (i.customId === 'backward' || i.customId === 'forward') && i.user.id === message.author.id;
    const collector = serverMessage.createMessageComponentCollector({ filter, time: 100000 });

    collector.on('collect', async (i) => {
        if (i.customId === 'backward') {
            if (pagina !== 1) {
                num = num - 10;
                num = num.toString().length > 1 ? num - parseInt(num.toString().slice(-1)) : 0;
                pagina -= 1;
            } else {
                pagina = totalPages;
                num = (totalPages * 10) - 10;
            }
        } else if (i.customId === 'forward') {
            if (pagina !== totalPages) {
                num = num.toString().length > 1 ? num - parseInt(num.toString().slice(-1)) : 0;
                num = num + 10;
                pagina += 1;
            } else {
                pagina = 1;
                num = 0;
            }

            embed.description = servers.map(se => `Nome: \`${se.name}\` - ID: \`${se.id}\` Users: \`${se.memberCount}\``).slice(num, num + 10).join('\n');
            serverMessage.edit({ embeds: [embed] });
        }
        i.deferUpdate();
    });

    collector.on('end', () => {
        serverMessage.edit({ components: [] }).catch(console.error);
    });
};
exports.help = {
	name: "servers",
	aliases: ['guilds'],
	description: "Mostra os servers que eu estou",
	usage: 'servers'
};