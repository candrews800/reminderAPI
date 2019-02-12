const cleanSeeds = require("./lib/clean_seeds");
const userSeeder = require("./lib/seed_users");
const reminderSeeder = require("./lib/seed_reminders");

exports.seed = async function(knex, seedOverrides) {
    await cleanSeeds(knex);

    let overrides = seedOverrides || {};

    await userSeeder.doSeed(knex, overrides.USERS);
    await reminderSeeder.doSeed(knex, overrides.REMINDERS);
};
