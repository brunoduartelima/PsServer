import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('term', table => {
        table.increments('id').primary();
        table.integer('amount').notNullable();
        table.decimal('value_entry', 5).nullable();
        table.date('due_date').notNullable();
        table.boolean('active').notNullable();
        table.integer('client_id').notNullable();
        table.integer('sale_id').notNullable();

        table.foreign('client_id')
            .references('id')
            .inTable('clients')
            .onUpdate('CASCADE');
        
        table.foreign('sale_id')
            .references('id')
            .inTable('sales')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('term');
}