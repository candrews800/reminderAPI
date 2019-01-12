const config = require("./config.json");

module.exports = Object.assign({}, config.defaults, config.development);