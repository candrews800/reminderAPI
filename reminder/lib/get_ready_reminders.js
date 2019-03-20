"use strict";

const knex = require("config/knex");

module.exports = async () => {
    return await knex("reminders")
        .where("remind_on", "<", new Date());
};