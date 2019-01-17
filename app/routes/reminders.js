const knex = require("config/knex");

const getReminders = async (req, res) => {
    const user = req.user;

    const reminders = await knex("reminders")
        .where("user_id", user.id)
        .orderBy("remind_on", "asc");

    res.statusCode(200).json(reminders);
};

module.exports = {
    getReminders
};