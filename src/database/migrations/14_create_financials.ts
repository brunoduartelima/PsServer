import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('financials', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('category').notNullable();
        table.string('description').nullable();
        table.string('type').notNullable();
        table.decimal('value', 5).notNullable();
        table.integer('parcel_amount').nullable();
        table.date('due_date').notNullable();
        table.boolean('active').notNullable();
        table.string('shop_id').notNullable();

        table.foreign('shop_id')
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE');

        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('financials');
}