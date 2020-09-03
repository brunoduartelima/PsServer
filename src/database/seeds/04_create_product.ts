import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('products').insert([
        {
            name: "Produto genérico 1",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Produto genérico 2",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Produto genérico 3",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "1"
        },
        {
            name: "Produto genérico 1",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Produto genérico 2",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Produto genérico 3",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "2"
        },
        {
            name: "Produto genérico 1",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "3"
        },
        {
            name: "Produto genérico 2",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "3"
        },
        {
            name: "Produto genérico 3",
            code: "",
            description: null,
            value: 99,
            amount: 10,
            averageCost: 35,
            category_id: null,
            shop_id: "3"
        },
    ]);
}