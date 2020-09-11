import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class ClientsController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {
            
            const client = await knex('clients')
                .where({shop_id})
                .join('shops_clients','clients.id', 'shops_clients.client_id')
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
                return response.status(400).send({ error: 'Não possui nenhum cliente cadastrado' });

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
                return response.status(400).send({ error: 'Nenhum parâmetro enviado para a pesquisa' });

            const client = await knex('clients')
                .where({shop_id})
                .join('shops_clients','clients.id', 'shops_clients.client_id')
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
                return response.status(400).send({ error: 'Nenhum resultado foi encontrado' });

            return response.json(client);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try {    
            const [count] = await knex('shops_clients').where({shop_id}).count();

            const client = await knex('clients')
                .where({shop_id})
                .join('shops_clients','clients.id', 'shops_clients.client_id')
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

            response.header('X-Total-Count', <string>count['count(*)']); 

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
                .where('shops_clients.shop_id', shop_id).andWhere('clients.cpf', cpf)
                .join('clients','shops_clients.client_id','clients.id')
                .first();

            if(controlClientCpf)
                return response.status(400).send({ error: 'Este CPF já está cadastrado' });

            const controlClientEmail = await knex('shops_clients')
                .where('shops_clients.shop_id', shop_id).andWhere('clients.email', email)
                .join('clients','shops_clients.client_id','clients.id')
                .first();

            if(controlClientEmail)
                return response.status(400).send({ error: 'Este e-mail já está em uso' });
            
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
                sex,
                email,
                cpf
            });

            const client_id = insertedId[0];

            await trx('shops_clients')
                .insert({
                    shop_id,
                    client_id,
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
                .where('shops_clients.shop_id', shop_id).andWhere('clients.id', id)
                .join('clients','shops_clients.client_id', 'clients.id')
                .select(
                    'clients.cpf',
                    'clients.email'
                )
                .first();

            if(!client)
                return response.status(400).send({ error: 'Falha ao tentar encontrar cliente' });

            if(client.cpf !== cpf) {
                const controlClientCpf = await knex('shops_clients')
                    .where('shops_clients.shop_id', shop_id).andWhere('clients.cpf', cpf)
                    .join('clients','shops_clients.client_id','clients.id')
                    .first();

                if(controlClientCpf)
                    return response.status(400).send({ error: 'Este CPF já está cadastrado' });
            }

            if(client.email !== email) {
                const controlClientEmail = await knex('shops_clients')
                    .where('shops_clients.shop_id', shop_id).andWhere('clients.email', email)
                    .join('clients','shops_clients.client_id','clients.id')
                    .first();

                if(controlClientEmail)
                    return response.status(400).send({ error: 'Este e-mail já está em uso' });
            }

            await knex('clients').where({id}).update({
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
                email
            });

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
                .where('shops_clients.shop_id', shop_id).andWhere('clients.id', id)
                .join('clients','shops_clients.client_id', 'clients.id')
                .first();


            if(!client)
                return response.status(400).send({ error: 'Falha ao tentar encontrar cliente' });
            
            await knex('clients').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error);
        }
    }
}

export default ClientsController;