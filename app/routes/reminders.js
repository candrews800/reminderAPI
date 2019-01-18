const moment = require("moment");

const knex = require("config/knex");

const getReminders = async (req, res) => {
    const user = req.user;

    if (!user) {
        res.statusCode(400).send("No user.");
        return;
    }

    const reminders = await knex("reminders")
        .where("user_id", user.id)
        .orderBy("remind_on", "asc");

    res.statusCode(200).json(reminders);
};

const postReminder = async (req, res) => {
    const user = req.user;

    if (!user) {
        res.statusCode(400).send("No user.");
        return;
    }

    const reminder = req.body;
    reminder.user_id = user.id;

    // Do not allow user to supply their own id
    if (typeof reminder.id !== "undefined") {
        res.statusCode(400).send("Cannot set id.");
        return;
    }

    if (
        typeof reminder.remind_on === "undefined"
    ) {
        res.statusCode(400).send("No remind_on provided.");
        return;
    }

    if (!moment(reminder.remind_on).isValid()) {
        res.statusCode(400).send("remind_on not a valid date.");
        return;
    }

    const results = await knex("reminders")
        .insert(req.body)
        .returning("*");

    res.statusCode(200).json(results[0]);
};

const putReminder = async (req, res) => {

};

module.exports = {
    getReminders,
    postReminder,
    putReminder
};