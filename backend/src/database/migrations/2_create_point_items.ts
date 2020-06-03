import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('point_items', (tablePoints) => {
    tablePoints.increments('id').primary();
    tablePoints.integer('id_point').notNullable().references('id').inTable('points');
    tablePoints.integer('id_item').notNullable().references('id').inTable('items');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('point_items');
}
