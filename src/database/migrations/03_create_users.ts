import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('type').notNullable();
        table.string('passwordResetToken').nullable();
        table.dateTime('passwordResetExpires', { precision: 6 }).nullable();

        table.integer('employee_id').nullable();
        table.string('shop_id').notNullable();

        table.foreign('employee_id')
            .references('id')
            .inTable('employees')
            .onUpdate('CASCADE');
        
        table.foreign('shop_id')
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
}