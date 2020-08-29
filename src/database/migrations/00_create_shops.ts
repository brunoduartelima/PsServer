import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('shops', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('phone').notNullable();
        table.integer('cpf').unique().notNullable();
        table.string('companyName').notNullable();
        table.string('companyType').notNullable();
        table.string('uf', 2).notNullable();
        table.string('city').notNullable();

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('shops');
}