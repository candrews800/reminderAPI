const moment = require("moment");

const knex = require("config/knex");
const NotAuthorizedError = require("app/lib/errors/NotAuthorizedError");
const ValidationError = require("app/lib/errors/ValidationError");
const NotFoundError = require("app/lib/errors/NotFoundError");

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

    const err = validReminder(reminder);
    if (err !== true) {
        throw new ValidationError(err);
    }

    reminder.user_id = user.id;

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

    const err = validReminder(req.body);
    if (err !== true) {
        throw new ValidationError(err);
    }

    await knex("reminders")
        .where("id", req.params.id)
        .update(req.body);

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

const validReminder = (reminder) => {
    // Do not allow user to supply their own id
    if (typeof reminder.id !== "undefined") {
        return "Cannot set id.";
    }

    // Do not allow user to supply the user_id
    if (typeof reminder.user_id !== "undefined") {
        return "Cannot set user id.";
    }

    if (typeof reminder.remind_on === "undefined") {
        return "No remind_on provided.";
    }

    if (!moment(reminder.remind_on).isValid()) {
        return "remind_on not a valid date.";
    }

    return true;
};

module.exports = {
    getReminders,
    postReminder,
    putReminder,
    deleteReminder
};