

module.exports = {
    functions: require("./others/functions"),
    logs: require("./others/logs"),
    vars: require("./others/vars"),
    mstohours: require('./others/mstohours'),
    mysql: require("./mysql/mysql"),
    schema: require("./mysql/schema"),
    embed: require("./extenders/embed"),
    attach: require("./extenders/attach"),
    canvas: require("./canvas/canvas"),
    splitText: require("./others/splitText"),
    imgDetect: require("./others/imgDetect"),
    defaltIcon: './img/others/miyascream.png',
    reloadcmds: require('./others/reloadcmds'),
    progess: require('./others/progess'),
    langs: require('./languages/index.js'), 
};