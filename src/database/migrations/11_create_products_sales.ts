import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('products_sales', table => {
        table.integer('amount').notNullable();
        table.integer('product_id').notNullable();
        table.integer('sale_id').notNullable();

        table.primary(['product_id', 'sale_id']);

        table.foreign('product_id')
            .references('id')
            .inTable('products')
            .onUpdate('CASCADE');

        table.foreign('sale_id')
            .references('id')
            .inTable('sales')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());

    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('products_sales');
}