import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('shops').insert([
        {
            name: "Bruno",
            companyName: "MonsterMalls",
            companyType: "Suplementos",
            cpf: 1299469,
            phone: "3484394648",
            uf: "MG",
            city: "Sacramento",
            id: "1"
        },
        {
            name: "Luana",
            companyName: "Marilda Mota",
            companyType: "Roupas",
            cpf: 10299469,
            phone: "3484394648",
            uf: "MG",
            city: "Sacramento",
            id: "2"
        },
        {
            name: "Lorena",
            companyName: "Marilda Mota",
            companyType: "Acessorios",
            cpf: 13299469,
            phone: "3484394648",
            uf: "MG",
            city: "Sacramento",
            id: "3"
        }
    ]);
}