"use strict";

const knex = require("config/knex");
const RemindOnCalculator = require("calc_remind_on_lib");

const getReadyReminders = async () => {
    return await knex("reminders")
        .where("remind_on", "<", new Date());
};

const processReminder = async (reminder) => {
    // TODO: SEND EMAIL

    const remindOnCalc = new RemindOnCalculator(reminder.schedule);

    return await knex("reminders")
        .where("id", reminder.id)
        .update({
            remind_on: remindOnCalc.getNextReminderDate()
        });
};

module.exports = {
    getReadyReminders,
    processReminder
};