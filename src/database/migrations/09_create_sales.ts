import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('sales', table => {
        table.increments('id').primary();
        table.string('type').notNullable();
        table.string('description').nullable();
        table.decimal('value', 5).notNullable();
        table.decimal('descont', 5).nullable();
        table.date('date').notNullable();
        table.integer('client_id').notNullable();
        table.string('shop_id').notNullable();

        table.foreign('client_id')
            .references('id')
            .inTable('clients')
            .onUpdate('CASCADE');
        
        table.foreign('shop_id')
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE');

        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('sales');
}