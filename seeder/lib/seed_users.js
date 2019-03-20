"use strict";

module.exports = {
    doSeed: function (knex, USERS) {
        return knex("users").insert(USERS || [
            this.USER_1
        ]);
    },
    USER_1: {
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        email: "test@important_date_reminders.com"
    },
};
