import { resolve } from 'path';
import { Config } from 'knex';

const configDb = {
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, 'data', 'nlw.sqlite'),
  },
  migrations: {
    directory: resolve(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: resolve(__dirname, 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
} as Config;

module.exports = configDb;
