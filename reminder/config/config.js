"use strict";

const config = require("./config.json");

module.exports = Object.assign({
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
}, config.defaults, config.development);