import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class ClientsController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {
            const [count] = await knex('shops_clients').where({shop_id}).count();
            
            const client = await knex('shops_clients')
                .where({shop_id})
                .join('clients', 'shops_clients.client_id', 'clients.id')
                .select(
                    'id',
                    'name',
                    'dateBirth',
                    'phoneFixed',
                    'whatsapp',
                    'address',
                    'addressNumber',
                    'neighborhood',
                    'cep',
                    'sex',
                    'cpf',
                    'email'
                )
                .orderBy('name')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(client.length === 0)
                return response.status(400).send({ error: 'Clients not found' });

            response.header('X-Total-Count', count['count(*)']);

            return response.json(client);
            
        } catch (error) {
            next(error);
        }
    }

    async search (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { name } = request.query;

        try {

            if(name === '')
                return response.status(400).send({ error: 'No search parameters sent' });

            const client = await knex('shops_clients')
                .where({shop_id})
                .join('clients', 'shops_clients.client_id', 'clients.id')
                .andWhere('name', 'like', '%'+String(name)+'%')
                .select(
                    'id',
                    'name',
                    'dateBirth',
                    'phoneFixed',
                    'whatsapp',
                    'address',
                    'addressNumber',
                    'neighborhood',
                    'cep',
                    'sex',
                    'cpf',
                    'email'
                )
                .orderBy('name');

            if(client.length === 0)
                return response.status(400).send({ error: 'Client not found' });

            return response.json(client);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try {    
            const [count] = await knex('shops_clients').where({shop_id}).count();

            const client = await knex('shops_clients')
                .where({shop_id})
                .join('clients', 'shops_clients.client_id', 'clients.id')
                .select(
                    'id',
                    'name',
                    'dateBirth',
                    'phoneFixed',
                    'whatsapp',
                    'address',
                    'addressNumber',
                    'neighborhood',
                    'cep',
                    'sex',
                    'cpf',
                    'email'
                )
                .orderBy('id', 'desc')
                .limit(30);

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(client);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {  
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            name,
            dateBirth,
            phoneFixed,
            whatsapp,
            email,
            cpf,
            address,
            addressNumber,
            neighborhood,
            cep,
            sex } = request.body;
        
        try {

            const controlClientCpf = await knex('shops_clients')
                .where({shop_id})
                .where({cpf})
                .first();

            if(controlClientCpf)
                return response.status(400).send({ error: 'CPF already registered' });

            const controlClientEmail = await knex('shops_clients')
                .where({shop_id})
                .where({email})
                .first();

            if(controlClientEmail)
                return response.status(400).send({ error: 'E-mail already registered' });
            
            const trx = await knex.transaction();

            const insertedId = await trx('clients').insert({
                name,
                dateBirth,
                phoneFixed,
                whatsapp,
                address,
                addressNumber,
                neighborhood,
                cep,
                sex
            });

            const client_id = insertedId[0];

            await trx('shops_clients')
                .insert({
                    shop_id,
                    client_id,
                    email,
                    cpf
                });
            
            await trx.commit();

            response.status(201).send();

        } catch (error) {
            next(error);
        }
    }

    async update (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;

        const {
            name,
            dateBirth,
            phoneFixed,
            whatsapp,
            address,
            addressNumber,
            neighborhood,
            cep,
            sex,
            cpf,
            email } = request.body;

        try {
            
            const client = await knex('shops_clients')
                .where('client_id', id)
                .where({shop_id})
                .select('shop_id', 'cpf', 'email')
                .first();

            if(!client)
                return response.status(400).send({ error: 'Client not found' });

            if(client.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });

            if(client.cpf !== cpf) {
                const controlClientCpf = await knex('shops_clients')
                    .where({shop_id})
                    .where({cpf})
                    .first();

                if(controlClientCpf)
                    return response.status(400).send({ error: 'CPF already registered' });
            }

            if(client.email !== email) {
                const controlClientEmail = await knex('shops_clients')
                    .where({shop_id})
                    .where({email})
                    .first();

                if(controlClientEmail)
                    return response.status(400).send({ error: 'E-mail already registered' });
            }

            const trx = await knex.transaction();

            await trx('clients').where({id}).update({
                name,
                dateBirth,
                phoneFixed,
                whatsapp,
                address,
                addressNumber,
                neighborhood,
                cep,
                sex
            });

            await trx('shops_clients').where({client_id: id}).update({
                cpf,
                email
            });

            await trx.commit();

            response.status(200).send();

        } catch (error) {
            next(error);
        }
    }

    async delete (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;

        try {

            const client = await knex('shops_clients')
                .where('client_id', id)
                .where({shop_id})
                .select('shop_id')
                .first();

            if(!client)
                return response.status(400).send({ error: 'Client not found' });

            if(client.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });
            
            await knex('clients').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error);
        }
    }
}

export default ClientsController;