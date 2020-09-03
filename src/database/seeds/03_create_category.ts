import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('categorys').insert([
        {
            name: "Categoria 1",
            description: null,
            shop_id: "1"
        },
        {
            name: "Categoria 1",
            description: null,
            shop_id: "2"
        },
        {
            name: "Categoria 1",
            description: null,
            shop_id: "3"
        }
    ]);
}