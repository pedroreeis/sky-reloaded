const { inspect } = require("util");

module.exports.run = async({ client, message, args, lang }) => {

    if (!client.devs.includes(message.author.id)) return;

    let code = args.join(" ")

    if (!code) return message.reply("Você não digitou nada :(")

    const user = (id) => client.users.cache.find((user) => user.id == id);
    const canal = (id) => client.channels.cache.find((c) => c.id == id);
    const role = (id) => message.guild.roles.cache.find((r) => r.id == id);
    const emoji = (id) => client.emojis.cache.find((r) => r.id == id);

    code = code.replace(/^`{3}(js)?|`{3}$/g, '')
    code = code.replace(/<@!?(\d{16,20})>/g, 'user($1)');
    code = code.replace(/<#?(\d{16,20})>/g, 'canal($1)');
    code = code.replace(/<@&?(\d{16,20})>/g, 'role($1)')
    code = code.replace(/<a?:.+:([0-9]+)>/g, 'emoji($1)')

    let result;

    try {
        const evaled = await eval(code);
        result = inspect(evaled, { depth: 0 }).replace(client.token, '*'.repeat(client.token.length))
    } catch (error) {
        result = error.toString();
    };


    if (result.includes(client.token)) return message.reply('*'.repeat(client.token.length))

    result = result.replace(/message.guild.members.cache.get\("(\d{16,18})"\)/g, "<@$1>");
    
    message.reply('```' + result + '```')
}

exports.help = {
    name: "eval",
    aliases: ['eval', 'executarcmds', 'e'],
    description: "Executa CMD's",
    usage: 'eval [code]'
};