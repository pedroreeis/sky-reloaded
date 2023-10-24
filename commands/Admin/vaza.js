exports.run = async({ client, message, args, lang }) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(lang.ban.perm);

    const memberQuery = args[0];
    var member_in = message.guild.members.cache.find((member) => 
        member.user.id === memberQuery) || message.mentions.members.first();

    if (!member_in && message.reference && message.reference.messageID) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageID);
        member_in = referencedMessage.member;
    }

    if(!member_in) return message.reply(lang.ban.invalidMember);

    try {
        member_in.send('Você foi banido do servidor. Motivo: Via FASTBAN');
        await member_in.ban({ reason: 'Você foi banido do servidor. Motivo: Via FASTBAN' });
        message.channel.send('Usuário banido com sucesso!', { ephemeral: true });
    } catch {
        message.channel.send('Eu não tenho permissão para banir esse membro :(', { ephemeral: true });
    }
}
exports.help = {
    name: "vaza",
    aliases: ['xispa', 'fastban'],
    description: "Banir o jogador mencionado com um motivo predefinido.",
    usage: 'vaza [@user|user|id|any]'
};
