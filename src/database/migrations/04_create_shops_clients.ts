import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('shops_clients', table => {

        table.integer('shop_id')
            .notNullable()
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE');

        table.integer('client_id')
            .notNullable()
            .references('id')
            .inTable('clients')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        
        table.integer('cpf').notNullable();
        table.string('email').nullable();
        
        table.primary(['shop_id', 'client_id']);

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('shops_clients');
}