const assert = require("assert");
const moment = require("moment");

const getReadyReminders = require("lib/get_ready_reminders");
const knex = require("config/knex");

const seeder = require("seeds/seed");
const reminderSeeder = require("seeds/lib/seed_reminders");

const DATE_FORMAT = "YYYY-MM-DD";
const YESTERDAY_DATE = moment().subtract("1", "day").format(DATE_FORMAT);
const TOMORROW_DATE = moment().add("1", "day").format(DATE_FORMAT);

const getDefaultReminderSeed = () => {
    return Array.from(reminderSeeder.REMINDERS);
};

const seedReminders = async reminders => {
    return seeder.seed(knex, {
        REMINDERS: reminders
    });
};

describe("getReadyReminders", () => {
    after(async () => {
        // release pg connections or tests will not complete
        await knex.destroy();
    });

    it("should return no reminders when no reminders have remind_on older than the present date", async () => {
        const reminders = getDefaultReminderSeed();

        for (const reminder of reminders) {
            reminder.remind_on = TOMORROW_DATE;
        }

        await seedReminders(reminders);

        const result = await getReadyReminders();

        assert.equal(result.length, 0);
    });

    it("should return 1 reminder when 1 reminder has remind_on older than the present date", async () => {
        const reminders = getDefaultReminderSeed();

        for (const reminder of reminders) {
            reminder.remind_on = TOMORROW_DATE;
        }

        reminders[0].remind_on = YESTERDAY_DATE;

        await seedReminders(reminders);

        const result = await getReadyReminders();

        assert.equal(result.length, 1);
    });

    it("should return 2 reminders when 2 reminders has remind_on older than the present date", async () => {
        const reminders = getDefaultReminderSeed();

        for (const reminder of reminders) {
            reminder.remind_on = TOMORROW_DATE;
        }

        reminders[0].remind_on = YESTERDAY_DATE;
        reminders[1].remind_on = YESTERDAY_DATE;

        await seedReminders(reminders);

        const result = await getReadyReminders();

        assert.equal(result.length, 2);
    });
});