"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.alterTable("reminders", function (table) {
        table.boolean("enabled");
        table.json("meta");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("reminders");
};
