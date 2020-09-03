import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class ServicesController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const service = await knex('services')
                .where('services.shop_id', shop_id)
                .leftJoin('categorys','services.category_id','categorys.id')
                .select(
                    'services.id',
                    'services.name',
                    knex.raw('ifnull(services.description, "não possui") as description'),
                    'services.value',
                    'services.averageTime',
                    knex.raw('ifnull(categorys.name, "não possui") as category_name')
                )
                .orderBy('services.name')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(service.length === 0)
                return response.status(400).send({ error: 'Services not found' });

            return response.json(service);
            
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

            const service = await knex('services')
                .where('services.shop_id', shop_id)
                .leftJoin('categorys','services.category_id','categorys.id')
                .select(
                    'services.id',
                    'services.name',
                    knex.raw('ifnull(services.description, "não possui") as description'),
                    'services.value',
                    'services.averageTime',
                    knex.raw('ifnull(categorys.name, "não possui") as category_name')
                )
                .orderBy('services.name')
                .andWhere('services.name', 'like', '%'+String(name)+'%');
            
            if(service.length === 0)
                return response.status(400).send({ error: 'Service not found' });

            return response.json(service);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try { 
            
            const [count] = await knex('services').where({shop_id}).count();

            const service = await knex('services')
                .where('services.shop_id', shop_id)
                .leftJoin('categorys','services.category_id','categorys.id')
                .select(
                    'services.id',
                    'services.name',
                    knex.raw('ifnull(services.description, "não possui") as description'),
                    'services.value',
                    'services.averageTime',
                    knex.raw('ifnull(categorys.name, "não possui") as category_name')
                )
                .orderBy('services.id', 'desc')
                .limit(30);

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(service);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            name,
            description,
            value,
            averageTime,
            category } = request.body;

        try {

            const service = await knex('services')
                .where({shop_id})
                .where({name})
                .first();

            if(service)
                return response.status(400).send({ error: 'Name already used' });

            if(category !== null) {
                const checkCategory = await knex('categorys')
                    .where({shop_id}).andWhere('id', category)
                    .first();

                if(!checkCategory)
                    return response.status(400).send({ error: 'Categoria não encontrada' });
            }

            await knex('services').insert({
                name,
                description,
                value,
                averageTime,
                category_id: category,
                shop_id
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
            name,
            description,
            value,
            averageTime,
            category } = request.body;
        
        try {
            
            const service = await knex('services')
                .where({shop_id})
                .where({id})
                .select('name')
                .first();
            
            if(!service)
                return response.status(400).send({ error: 'Service not found' });

            if(service.name !== name) {
                const checkName = await knex('services')
                    .where({shop_id}).andWhere({name})
                    .first();
                
                if(checkName)
                    return response.status(400).send({ error: 'Este nome já existe, tente outro'});
            }
            
            if(category !== null) {
                const checkCategory = await knex('categorys')
                    .where({shop_id}).andWhere('id', category)
                    .first();

                if(!checkCategory)
                    return response.status(400).send({ error: 'Categoria não encontrada' });
            }


            await knex('products').where({id}).update({
                name,
                description,
                value,
                averageTime,
                category_id: category
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

            const service = await knex('services')
                .where({shop_id})
                .where({id})
                .first();
            
            if(!service)
                return response.status(400).send({ error: 'Service not found' });

            await knex('services').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default ServicesController;