"use string";

exports.up = function(knex, Promise) {
    return knex.schema.createTable("reminders", function (table) {
        table.increments();
        table.timestamps();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.date("remind_on");
        table.json("schedule");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("reminders");
};
