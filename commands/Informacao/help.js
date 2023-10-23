exports.run = async ({ client, message, args, prefix, lang }) => {

    try {


        let e = new client.utils.embed(message.author);

        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            e.setTitle(lang.help.helpAq.replace("+cmd+", command.help.name))
            e.addFields([
                {name: lang.help.helpCmd.replace("+cmd+", command.help.name), value: `\`\`\`ini\n[ ${command.help.description} ]\`\`\``, inline: false},
                {name: lang.help.helpUsage, value: `\`${prefix}${command.help.usage}\``, inline: false},
                {name: lang.help.helpAlter, value: `\`${command.help.aliases}\``, inline: false},
                {name: lang.help.helpObs, value: lang.help.helpParameter, inline: false},
            ])
            message.reply({ embeds: [e]})
        }
        const valuesA = Array.from(client.commandsSeparated);

        const gg = lang.help.helpExample.replace("+prefix+", prefix) //`${await client.utils.lang(lang, 'cmdHelp')} \`${prefix}${await client.utils.lang(lang, 'cmdUse')}\``

        valuesA.forEach(async val => {
            let name = val.shift();

            let modiArray = name
                .replace('Admin', '👮 Admin')
                .replace('Discord', '❤ Discord')
                .replace('Diversao', '😂 Diversão')
                .replace('Informacao', '📖 Informações')
                .replace('Diversao', '😂 Diversão')
                .replace('Rank', '🔶 Rank')
            if (name == "Owner" || name == "Nsfw") return 0;


            e.setDescription(gg)
            //e.addFields(`${modiArray}`, `\`${val.toString().replace(/,/g, ", ").replace(/.js/g, "")}\``);
            e.addFields([
                {name: `${modiArray}`, value: `\`${val.toString().replace(/,/g, ", ").replace(/.js/g, "")}\``, inline: false}
            ])
        })
        if (args[0] === undefined || args[0] === null) return message.reply({ embeds: [e]})
    } catch (e) {
        message.reply(`\`\`\`${e.name}: ${e.message}\`\`\``);
    }
}

exports.help = {
    name: "help",
    aliases: ['ajuda'],
    description: "Mostra minha lista de comandos",
    usage: 'ajuda'
};