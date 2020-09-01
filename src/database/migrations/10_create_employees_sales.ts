import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('employees_sales', table => {
        table.decimal('commission').nullable();
        table.integer('employee_id').notNullable();
        table.integer('sale_id').notNullable();

        table.primary(['employee_id', 'sale_id']);

        table.foreign('employee_id')
            .references('id')
            .inTable('employees')
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
    return knex.schema.dropTable('employees_sales');
}