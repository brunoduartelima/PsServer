import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class CreditsController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const credit = await knex('sales')
                .join('credits', 'sales.id', 'credits.sale_id')
                .join('clients', 'sales.client_id', 'clients.id')
                .where({shop_id})
                .select(
                    'credits.id',
                    'credits.amount',
                    'credits.value_entry',
                    'credits.due_date',
                    knex.raw('case when credits.active = true then "Dívida ativa" else "Dívida paga" end as active'),
                    'sales.value',
                    'clients.name'
                )
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(credit.length === 0)
                return response.status(400).send({ error: 'Não possui nenhuma venda a prazo cadastrada' });

            return response.json(credit);
            
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

                const credit = await knex('sales')
                    .join('credits', 'sales.id', 'credits.sale_id')
                    .join('clients', 'sales.client_id', 'clients.id')
                    .where({shop_id})
                    .andWhere('clients.name', 'like', '%'+String(name)+'%')
                    .select(
                        'credits.id',
                        'credits.amount',
                        'credits.value_entry',
                        'credits.due_date',
                        knex.raw('case when credits.active = true then "Dívida ativa" else "Dívida paga" end as active'),
                        'sales.value',
                        'clients.name'
                    )
                    .limit(30)
                    .orderBy('name')

            if(credit.length === 0)
                return response.status(400).send({ error: 'Não possui nenhuma venda a prazo cadastrada' });

            return response.json(credit);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            amount,
            value_entry,
            due_date,
            active,
            sale_id } = request.body;

        try {

            const sale = await knex('sales')
                .where('id', sale_id).andWhere({shop_id})
                .first();

            if(!sale)
                return response.status(400).send({ error: 'Falha ao tentar encontrar venda' })

            await knex('credits').insert({
                amount,
                value_entry,
                due_date,
                active,
                sale_id
            });

            response.status(201).send();

        } catch (error) {
            next(error)
        }
    }

    async update (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;

        const {
            amount,
            value_entry,
            due_date,
            active } = request.body;
        
        try {
            
            const credit = await knex('credits')
                .join('sales', 'credits.sale_id', 'sales.id')
                .where('credits.id', id)
                .andWhere({shop_id})
                .first();

            
            if(!credit)
                return response.status(400).send({ error: 'Falha ao tentar encontrar venda a prazo' });

            await knex('credits').where({id}).update({
                amount,
                value_entry,
                due_date,
                active
            });

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }

    async delete (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;
        
        try {

            const credit = await knex('credits')
                .join('sales', 'credits.sale_id', 'sales.id')
                .where('credits.id', id)
                .andWhere({shop_id})
                .first();

        
            if(!credit)
                return response.status(400).send({ error: 'Falha ao tentar encontrar venda a prazo' });

            await knex('credits').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default CreditsController;