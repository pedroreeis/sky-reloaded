const { AttachmentBuilder } = require("discord.js");

module.exports = class attach extends AttachmentBuilder {
    constructor(obj, attachName = {}) {
        super(obj, attachName);
        this.name = attachName;
    }
};
