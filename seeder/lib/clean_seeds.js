"use strict";

module.exports = async function (knex) {
    await knex("reminders").del();
    await knex("users").del();
};