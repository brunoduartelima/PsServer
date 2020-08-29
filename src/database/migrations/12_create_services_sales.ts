import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('services_sales', table => {

        table.integer('service_id')
            .notNullable()
            .references('id')
            .inTable('services')
            .onUpdate('CASCADE');

        table.integer('sale_id')
            .notNullable()
            .references('id')
            .inTable('sales')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table.primary(['service_id', 'sale_id']);

        table.integer('amount').notNullable();

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('services_sales');
}