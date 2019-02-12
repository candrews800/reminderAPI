module.exports = {
    doSeed: function (knex, REMINDERS) {
        return knex("reminders").insert(REMINDERS || this.REMINDERS);
    },
    REMINDERS: [
        {
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: 1,
            remind_on: "2019-01-01"
        },
        {
            id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: 1,
            remind_on: "2019-02-01"
        },
        {
            id: 3,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: 1,
            remind_on: "2019-03-01"
        }
    ]
};