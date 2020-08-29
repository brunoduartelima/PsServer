import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('products_sales', table => {

        table.integer('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onUpdate('CASCADE');

        table.integer('sale_id')
            .notNullable()
            .references('id')
            .inTable('sales')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table.primary(['product_id', 'sale_id']);

        table.integer('amount').notNullable();

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());

    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('products_sales');
}