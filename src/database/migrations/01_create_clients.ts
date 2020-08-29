import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('clients', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.date('dateBirth').notNullable();
        table.string('phoneFixed').nullable();
        table.string('whatsapp').notNullable();
        table.string('address').notNullable();
        table.string('addressNumber').notNullable();
        table.string('neighborhood').notNullable();
        table.string('cep').notNullable();
        table.string('sex').notNullable();

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now()); 
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('clients');
}