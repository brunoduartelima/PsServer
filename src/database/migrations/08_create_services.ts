import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.decimal('value', 5).notNullable();
        table.integer('averageTime').notNullable();
        table.integer('category_id').nullable();
        table.string('shop_id').notNullable();

        table.foreign('category_id')
            .references('id')
            .inTable('categorys')
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
    return knex.schema.dropTable('services');
}