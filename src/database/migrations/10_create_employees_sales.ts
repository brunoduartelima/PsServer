import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('employees_sales', table => {

        table.integer('employee_id')
            .notNullable()
            .references('id')
            .inTable('employees')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.integer('sale_id')
            .notNullable()
            .references('id')
            .inTable('sales')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table.primary(['employee_id', 'sale_id']);

        table.decimal('commission').nullable();

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('employees_sales');
}