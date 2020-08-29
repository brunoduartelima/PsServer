import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('categorys', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.integer('shop_id').notNullable();

        table.foreign('shop_id').references('id').inTable('shops').onDelete('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('categorys');
}