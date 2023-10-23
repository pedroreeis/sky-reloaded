const { EmbedBuilder } = require("discord.js");

module.exports = class Embed extends EmbedBuilder {
    constructor(member, obj = {}) {
        super(obj);
        this.name = "embed";
    }
};