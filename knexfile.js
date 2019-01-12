const config = require("./config/config");

module.exports = {

  development: {
    client: "postgresql",
    connection: config.pg,
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {

  },

  production: {

  }

};
