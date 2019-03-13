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
            remind_on: "2019-01-01",
            schedule: {
                month: 0,
                day: 1,
                morningOf: true,
                startOfMonth: true,
                weeksPrior: [],
                daysPrior: []
            }
        },
        {
            id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: 1,
            remind_on: "2019-02-01",
            schedule: {
                month: 1,
                day: 1,
                morningOf: true,
                startOfMonth: true,
                weeksPrior: [],
                daysPrior: []
            }
        },
        {
            id: 3,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: 1,
            remind_on: "2019-03-01",
            schedule: {
                month: 2,
                day: 1,
                morningOf: true,
                startOfMonth: true,
                weeksPrior: [],
                daysPrior: []
            }
        }
    ]
};