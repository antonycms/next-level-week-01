import knex, { ConnectionConfigProvider } from 'knex';
import dbConfig from '../config/database';

class Database {
  static connection: ConnectionConfigProvider;

  constructor() {
    Database.init();
  }

  private static init() {
    if (!Database.connection) {
      Database.connection = knex(dbConfig);
    }
  }
}

export default new Database();
