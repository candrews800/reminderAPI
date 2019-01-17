const cleanSeeds = require("./lib/clean_seeds");
const userSeeder = require("./lib/seed_users");
const reminderSeeder = require("./lib/seed_reminders");

exports.seed = async function(knex) {
    await cleanSeeds(knex);

    await userSeeder.doSeed(knex);
    await reminderSeeder.doSeed(knex);
};
