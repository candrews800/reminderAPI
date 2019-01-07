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
    client: "postgresql",
    connection: {
      database: "my_db",
      user:     "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {

  }

};
