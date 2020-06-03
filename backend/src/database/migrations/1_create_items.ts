import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('items', (tablePoints) => {
    tablePoints.increments('id').primary();
    tablePoints.string('image').notNullable();
    tablePoints.string('title').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('items');
}
