"use strict";

const config = require("../config/config");

module.exports = require("knex")({
    client: "pg",
    connection: config.pg,
});