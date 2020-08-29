import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('installments', table => {
        table.increments('id').primary();
        table.decimal('value', 5).notNullable();
        table.date('due_date').notNullable();
        table.boolean('active').notNullable();
        table.integer('term_id').nullable();
        table.integer('financial_id').nullable();

        table.foreign('term_id').references('id').inTable('term').onDelete('CASCADE').onUpdate('CASCADE');
        table.foreign('financial_id').references('id').inTable('financials').onDelete('CASCADE').onUpdate('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('installments');
}