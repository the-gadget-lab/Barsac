// Singleton Knex instance shared across the app, built from knexfile.js.
const knexLib = require("knex");
const config = require("../../knexfile");

// knexfile exports both env keys and the flat config; use the flat fields.
const knex = knexLib({
  client: config.client,
  connection: config.connection,
  useNullAsDefault: config.useNullAsDefault,
  pool: config.pool,
  migrations: config.migrations,
  seeds: config.seeds,
});

module.exports = knex;
