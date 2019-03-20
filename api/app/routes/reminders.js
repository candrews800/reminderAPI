"use strict";

const moment = require("moment");

const knex = require("config/knex");
const NotAuthorizedError = require("app/lib/errors/NotAuthorizedError");
const ValidationError = require("app/lib/errors/ValidationError");
const NotFoundError = require("app/lib/errors/NotFoundError");
const RemindOnCalculator = require("calc_remind_on_lib");

const DATE_FORMAT = "YYYY-MM-DD";

const getReminders = async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new NotAuthorizedError();
    }

    const reminders = await knex("reminders")
        .where("user_id", user.id)
        .orderBy("remind_on", "asc");

    res.statusCode(200).json(reminders);
};

const postReminder = async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new NotAuthorizedError();
    }

    const reminder = req.body;

    const err = validateReminder(reminder);
    if (err !== true) {
        throw new ValidationError(err);
    }

    reminder.user_id = user.id;

    const remindOnCalc = new RemindOnCalculator(reminder.schedule);
    reminder.remind_on = remindOnCalc.getNextReminderDate().format(DATE_FORMAT);

    const results = await knex("reminders")
        .insert(req.body)
        .returning("*");

    res.statusCode(200).json(results[0]);
};

const putReminder = async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new NotAuthorizedError();
    }

    const reminder = await knex("reminders")
        .where("id", req.params.id)
        .first();

    if (!reminder) {
        throw new NotFoundError();
    }

    if (user.id !== reminder.user_id) {
        throw new NotAuthorizedError();
    }

    const err = validateReminder(req.body);
    if (err !== true) {
        throw new ValidationError(err);
    }

    const remindOnCalc = new RemindOnCalculator(req.body.schedule);
    const params = Object.assign({}, req.body, {
        remind_on: remindOnCalc.getNextReminderDate().format(DATE_FORMAT)
    });

    await knex("reminders")
        .where("id", req.params.id)
        .update(params);

    res.statusCode(200).json(reminder);
};

const deleteReminder = async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new NotAuthorizedError();
    }

    const reminder = await knex("reminders")
        .where("id", req.params.id)
        .first();

    if (!reminder) {
        throw new NotFoundError();
    }

    if (user.id !== reminder.user_id) {
        throw new NotAuthorizedError();
    }

    await knex("reminders")
        .where("id", req.params.id)
        .delete();

    res.statusCode(200).json({});
};

const validateSchedule = (schedule) => {
    if (!schedule || typeof schedule !== "object") {
        return "invalid schedule object";
    }

    const validateDate = () => {
        const month = schedule.month;
        const day = schedule.day;

        return moment(`2019-${month}-${day}`, DATE_FORMAT).isValid() ? true : value + " is not a valid date";
    };

    const rules = {
        month: validateDate,
        day: validateDate,
        dayOf: (value) => { return typeof value === "boolean"; },
        startOfMonth: (value) => { return typeof value === "boolean"; },
        weeksPrior: (value) => { return Array.isArray(value); },
        daysPrior: (value) => { return Array.isArray(value); },
    };

    let err;

    for (const key in rules) {
        if (!rules.hasOwnProperty(key)) continue;

        if (!schedule.hasOwnProperty(key)) {
            return "missing schedule key: " + key;
        }

        // validate the selected key's rules
        err = rules[key](schedule[key]);

        if (err !== true) {
            return err;
        }
    }

    return true;
};

const validateReminder = (reminder) => {
    // Do not allow user to supply their own id
    if (typeof reminder.id !== "undefined") {
        return "Cannot set id.";
    }

    // Do not allow user to supply the user_id
    if (typeof reminder.user_id !== "undefined") {
        return "Cannot set user id.";
    }

    // Do not allow user to supply the remind_on field
    if (typeof reminder.remind_on !== "undefined") {
        return "Cannot set remind_on.";
    }

    const err = validateSchedule(reminder.schedule);

    if (err !== true) {
        return err;
    }

    return true;
};

module.exports = {
    getReminders,
    postReminder,
    putReminder,
    deleteReminder
};