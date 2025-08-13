// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },
  compose: {
    client: 'postgresql',
    connection: {
      host:     process.env.QUREAU_DATABASE__HOST,
      port:     process.env.QUREAU_DATABASE__PORT,
      database: process.env.QUREAU_DATABASE__DB_0,
      user:     process.env.QUREAU_DATABASE__DB_0__WRITER_username,
      password: process.env.QUREAU_DATABASE__DB_0__WRITER_password
    },
    migrations: {
      tableName: 'qureau_migrations'
    }
  },
};
