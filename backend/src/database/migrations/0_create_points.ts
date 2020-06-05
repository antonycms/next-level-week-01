import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('points', (tablePoints) => {
    tablePoints.increments('id').primary();
    tablePoints.string('image').notNullable();
    tablePoints.string('name').notNullable();
    tablePoints.string('email').notNullable();
    tablePoints.string('whatsapp').notNullable();
    tablePoints.decimal('latitude').notNullable();
    tablePoints.decimal('longitude').notNullable();
    tablePoints.string('city').notNullable();
    tablePoints.string('uf', 2).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('points');
}
