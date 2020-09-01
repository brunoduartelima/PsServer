import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('employees').insert([
        {
            name: "Bruno",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "1"
        },
        {
            name: "Luana",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "2"
        },
        {
            name: "Lorena",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "3"
        },
        {
            name: "Diego",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "1"
        },
        {
            name: "Maria",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "1"
        },
        {
            name: "Jose",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "1"
        },
        {
            name: "Diego",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "2"
        },
        {
            name: "Maria",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "2"
        },
        {
            name: "Jose",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "2"
        },
        {
            name: "Diego",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "3"
        },
        {
            name: "Maria",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "3"
        },
        {
            name: "Jose",
            salary: 4200.99,
            dateBirth: "27121993",
            whatsapp: "1321321",
            active: true,
            shop_id: "3"
        }
    ]);
}