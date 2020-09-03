import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('services').insert([
        {
            name: "Serviço genérico 1",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Serviço genérico 2",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Serviço genérico 3",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Serviço genérico 1",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Serviço genérico 2",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Serviço genérico 3",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Serviço genérico 1",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "3"
        },
        {
            name: "Serviço genérico 2",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "3"
        },
        {
            name: "Serviço genérico 3",
            description: null,
            value: 35,
            averageTime: 30,
            category_id: null,
            shop_id: "3"
        }
    ]);
}