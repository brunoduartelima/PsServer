import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('services').insert([
        {
            name: "Serviço genérico 1",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "1"
        },
        {
            name: "Serviço genérico 2",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "1"
        },
        {
            name: "Serviço genérico 3",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "1"
        },
        {
            name: "Serviço genérico 1",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "2"
        },
        {
            name: "Serviço genérico 2",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "2"
        },
        {
            name: "Serviço genérico 3",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "2"
        },
        {
            name: "Serviço genérico 1",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "3"
        },
        {
            name: "Serviço genérico 2",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "3"
        },
        {
            name: "Serviço genérico 3",
            description: "",
            value: 35,
            averageTime: 30,
            category_id: "NULL",
            shop_id: "3"
        }
    ]);
}