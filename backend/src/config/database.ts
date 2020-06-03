import { Config } from 'knex';
import { resolve } from 'path';

export default {
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, '..', '..', 'data', 'nlw.sqlite'),
  },
  useNullAsDefault: true,
} as Config;
