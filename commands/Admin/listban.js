const { EmbedBuilder } = require("discord.js")
exports.run = async({ client, message, args, lang }) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(lang.ban.perm);

    message.guild.members.fetchBans().then(banned => {
    let list = banned.map(user => user.user.tag).join('\n');
    var embed = new EmbedBuilder().setTitle(`Lista de banidos:`).setDescription(list).setColor('RED');
    message.reply({ embeds: [embed] });
  })
  .catch(console.error);
}
exports.help = {
    name: "listban",
    aliases: ['listarban'],
    description: "Liste todos os banimentos do servidor.",
    usage: 'listban'
};
