"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", function (table) {
        table.increments();
        table.timestamps();
        table.string("email");
        table.string("hash");
        table.string("salt");
        table.json("details");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("users");
};
