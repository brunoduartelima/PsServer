import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('shops_clients', table => {
        table.integer('cpf').notNullable();
        table.string('email').nullable();
        table.string('shop_id').notNullable();
        table.integer('client_id').notNullable();

        table.primary(['shop_id', 'client_id']);

        table.foreign('shop_id')
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE');

        table.foreign('client_id')
            .references('id')
            .inTable('clients')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('shops_clients');
}