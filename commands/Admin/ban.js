const { EmbedBuilder, ActionRowBuilder, ButtonBuilder  } = require("discord.js");

exports.run = async({ client, message, args, lang }) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(lang.ban.perm);

    const memberQuery = args[0];
    var member_in = message.guild.members.cache.find((member) => 
        member.user.tag.toLowerCase().includes(memberQuery.toLowerCase()) || 
        member.user.id === memberQuery) || message.mentions.members.first();


    if(!member_in) return message.reply(lang.ban.invalidMember);

    var motivo = args.slice(1).join(' ');


    const banButton = new ButtonBuilder()
        .setCustomId('ban')
        .setLabel('✅')
        .setStyle(1);

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('❌')
        .setStyle(4);

    const row = new ActionRowBuilder().addComponents(banButton, cancelButton);


    let embedquase = new EmbedBuilder()
    .setDescription(lang.ban.punishMessage.replace("+target+", member_in.user.tag).replace("+motivo+", motivo ? motivo : "Motivo não definido"))

    message.reply({ embeds: [embedquase], components: [row] }).then(async (msg) => {
        const filter = (i) => i.customId === 'ban' || i.customId === 'cancel';
        const collector = msg.createMessageComponentCollector({ filter, time: 100000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'ban') {
                try {
                    member_in.send('Você foi banido do servidor. Motivo: ' + motivo ? motivo : "Motivo não definido");
                    await member_in.ban({ reason: 'Você foi banido do servidor. Motivo: ' + motivo ? motivo : "Motivo não definido" });
                    i.reply('Usuário banido com sucesso!', { ephemeral: true });
                } catch {
                    i.reply('Eu não tenho permissão para banir esse membro :(', { ephemeral: true });
                }
            } else if (i.customId === 'cancel') {
                msg.delete();
            }
        });
    });
}
exports.help = {
    name: "ban",
    aliases: ['banir', 'banish', 'punish'],
    description: "Banir o jogador mencionado pelo motivo inserido.",
    usage: 'ban [@user] (reason)'
};
