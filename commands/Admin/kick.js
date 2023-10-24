const { EmbedBuilder, ActionRowBuilder, ButtonBuilder  } = require("discord.js");

exports.run = async({ client, message, args, lang }) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply(lang.kick.perm);

    const memberQuery = args[0];
    var member_in = message.guild.members.cache.find((member) => 
        member.user.tag.toLowerCase().includes(memberQuery.toLowerCase()) || 
        member.user.id === memberQuery) || message.mentions.members.first();


    if(!member_in) return message.reply(lang.kick.invalidMember);
    var motivo = args.slice(1).join(' ');


    const kickButton = new ButtonBuilder()
        .setCustomId('kick')
        .setLabel('✅')
        .setStyle(1);

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('❌')
        .setStyle(4);

    const row = new ActionRowBuilder().addComponents(kickButton, cancelButton);


    let embedquase = new EmbedBuilder()
    .setDescription(lang.kick.punishMessage.replace("+target+", member_in.user.tag).replace("+motivo+", motivo ? motivo : "Motivo não definido"))

    message.reply({ embeds: [embedquase], components: [row] }).then(async (msg) => {
        const filter = (i) => i.customId === 'kick' || i.customId === 'cancel';
        const collector = msg.createMessageComponentCollector({ filter, time: 100000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'kick') {
                try {
                    await member_in.kick({ reason: 'Você foi expulso do servidor. Motivo: ' + motivo ? motivo : "Motivo não definido" });
                    i.reply('Usuário expulso com sucesso!', { ephemeral: true });
                } catch {
                    i.reply('Eu não tenho permissão para expulsar esse membro :(', { ephemeral: true });
                }
            } else if (i.customId === 'cancel') {
                msg.delete();
            }
        });
    });
}
exports.help = {
    name: "kick",
    aliases: ['expulsar'],
    description: "Expulsar o jogador mencionado pelo motivo inserido.",
    usage: 'kick [@user] (reason)'
};
