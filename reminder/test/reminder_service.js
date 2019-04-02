const assert = require("assert");
const moment = require("moment");

const reminderService = require("lib/reminder_service");
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

describe("reminder service", () => {
    after(async () => {
        // release pg connections or tests will not complete
        await knex.destroy();
    });

    describe("getReadyReminders", () => {
        it("should return no reminders when no reminders have remind_on older than the present date", async () => {
            const reminders = getDefaultReminderSeed();

            for (const reminder of reminders) {
                reminder.remind_on = TOMORROW_DATE;
            }

            await seedReminders(reminders);

            const result = await reminderService.getReadyReminders();

            assert.equal(result.length, 0);
        });

        it("should return 1 reminder when 1 reminder has remind_on older than the present date", async () => {
            const reminders = getDefaultReminderSeed();

            for (const reminder of reminders) {
                reminder.remind_on = TOMORROW_DATE;
            }

            reminders[0].remind_on = YESTERDAY_DATE;

            await seedReminders(reminders);

            const result = await reminderService.getReadyReminders();

            assert.equal(result.length, 1);
        });

        it("should return reminder with email attached to object", async () => {
            const reminders = getDefaultReminderSeed();

            for (const reminder of reminders) {
                reminder.remind_on = TOMORROW_DATE;
            }

            reminders[0].remind_on = YESTERDAY_DATE;

            await seedReminders(reminders);

            const result = await reminderService.getReadyReminders();

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

            const result = await reminderService.getReadyReminders();

            assert.equal(result.length, 2);
        });
    });

    describe("processReminder", () => {
        it("should update remind_on based on schedule", async () => {
            const reminders = getDefaultReminderSeed();
            const reminder = reminders[0];

            reminder.schedule = {
                month: 3,
                day: 18,
                dayOf: true,
                startOfMonth: false,
                weeksPrior: [],
                daysPrior: []
            };

            reminder.remind_on = null;

            await seedReminders(reminders);

            await reminderService.processReminder(reminder);

            const actualReminder = await knex("reminders")
                .where("id", reminder.id)
                .first();

            assert.equal(
                moment(actualReminder.remind_on).format("MM-DD"),
                "04-18"
            );
        });
    });

    describe("sendEmail", () => {
        it("should send email to user of reminder", async () => {
            const reminders = getDefaultReminderSeed();
            const reminder = reminders[0];
            reminder.email = "test@reminder.com";

            const results = await reminderService.sendEmail(reminder);
            const message = JSON.parse(results.message);

            assert.equal(
                message.to[0].address,
                "test@reminder.com"
            );
        });

        it("should contain the scheduled date as part of the email body", async () => {
            const reminders = getDefaultReminderSeed();
            const reminder = reminders[0];
            const date = moment()
                .set("month", reminder.schedule.month)
                .set("date", reminder.schedule.day)
                .format("MMM Do");

            const results = await reminderService.sendEmail(reminder);
            const message = JSON.parse(results.message);
            const messageBody = message.text;

            assert.equal(
                true,
                messageBody.includes(date),
                "missing string: " + date
            );
        });

        it("should contain the meta title in the body", async () => {
            const reminders = getDefaultReminderSeed();
            const reminder = reminders[0];
            const TITLE = "Clinton's Birthday";

            reminder.meta = {
                title: TITLE
            };

            const results = await reminderService.sendEmail(reminder);
            const message = JSON.parse(results.message);
            const messageBody = message.text;

            assert.equal(
                true,
                messageBody.includes(TITLE),
                "missing string: " + TITLE
            );
        });
    });
});