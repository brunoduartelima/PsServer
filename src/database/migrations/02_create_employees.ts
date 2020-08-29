import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('employees', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('salary', 5).notNullable();
        table.date('dateBirth').notNullable();
        table.string('whatsapp').notNullable();
        table.boolean('active').notNullable();
        table.integer('shop_id').notNullable();

        table.foreign('shop_id').references('id').inTable('shops').onDelete('CASCADE').onUpdate('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());   
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('employees');
}