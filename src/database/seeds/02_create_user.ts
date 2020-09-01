import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('users').insert([
        { 
            email: "bruno@log.com", 
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "master", 
            shop_id: "1", 
            employee_id: 1 
        },
        { 
            email: "luana@log.com", 
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "master", 
            shop_id: "2", 
            employee_id: 2 
        },
        { 
            email: "lorena@log.com",
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "master", 
            shop_id: "3", 
            employee_id: 3 
        },
        { 
            email: "diego@log.com", 
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "regular", 
            shop_id: "1", 
            employee_id: 4
        },
        { 
            email: "maria@log.com", 
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "regular", 
            shop_id: "2", 
            employee_id: 8
        },
        { 
            email: "jose@log.com",
            password: "$2a$10$rfUb1ZEoycmsGYS7bB85Ke.lSDsgDcxLiUM.gajh3wzgLglMpVjq.", 
            type: "regular", 
            shop_id: "3", 
            employee_id: 12
        }
    ]);
}