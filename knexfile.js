// Single source of DB configuration. The running engine is chosen entirely by
// environment variables, so SQLite today and Postgres/MySQL tomorrow is a config
// change only — no application code changes.
require("dotenv").config();
const path = require("path");

const client = process.env.DB_CLIENT || "better-sqlite3";

function connection() {
  if (client === "better-sqlite3" || client === "sqlite3") {
    return { filename: process.env.DB_FILE || path.join(__dirname, "data", "barsac.sqlite") };
  }
  // pg / mysql2 / mssql all accept this shape
  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const isSqlite = client === "better-sqlite3" || client === "sqlite3";

const config = {
  client,
  connection: connection(),
  useNullAsDefault: isSqlite, // required by sqlite, harmless flag elsewhere
  pool: isSqlite
    ? { afterCreate: (conn, done) => conn.pragma ? (conn.pragma("foreign_keys = ON"), done(null, conn)) : done(null, conn) }
    : { min: 2, max: 10 },
  migrations: { directory: path.join(__dirname, "server", "db", "migrations") },
  seeds: { directory: path.join(__dirname, "server", "db", "seeds") },
};

// knex CLI expects an environment-keyed object; the app imports `config` directly.
module.exports = { development: config, production: config, ...config };
