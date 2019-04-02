"use strict";

const moment = require("moment");

const knex = require("config/knex");
const nodemailer = require("nodemailer");

const RemindOnCalculator = require("calc_remind_on_lib");

class ReminderService {
    async getReadyReminders() {
        return knex("reminders")
            .join("users", "reminders.user_id", "=", "users.id")
            .where("remind_on", "<", new Date());
    }

    async sendEmail(reminder) {
        const transporter = nodemailer.createTransport({
            jsonTransport: true
        });

        const date = moment()
            .set("month", reminder.schedule.month)
            .set("date", reminder.schedule.day)
            .format("MMM Do");

        const message = {
            from: "noreply@importantdatereminder.com",
            to: reminder.email,
            subject: "Upcoming Important Date",
            text: "The following important dates are coming up:\n\n" +
                reminder.meta.title + ": " + date
        };

        return new Promise((res, rej) => {
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    rej(err);
                    return;
                }

                res(info);
            });
        });
    }

    async processReminder(reminder) {
        await this.sendEmail(reminder);

        const remindOnCalc = new RemindOnCalculator(reminder.schedule);

        return await knex("reminders")
            .where("id", reminder.id)
            .update({
                remind_on: remindOnCalc.getNextReminderDate()
            });
    }
}

module.exports = new ReminderService();