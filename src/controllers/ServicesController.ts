import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class ServicesController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const service = await knex('services')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'description',
                    'value',
                    'averageTime'
                )
                .orderBy('name')
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
        const { products } = request.query;

        try {

            if(products === '')
                return response.status(400).send({ error: 'No search parameters sent' });

            let product = await knex('products')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'code',
                    'description',
                    'value',
                    'amount',
                    'averageCost'
                )
                .andWhere('name', 'like', '%'+String(products)+'%')
                .orderBy('name');

            if(product.length === 0) {
                product = await knex('products')
                    .where({shop_id})
                    .select(
                        'id',
                        'name',
                        'code',
                        'description',
                        'value',
                        'amount',
                        'averageCost'
                    )
                    .andWhere('code', 'like', '%'+String(products)+'%')
                    .orderBy('name');
            }
            
            if(product.length === 0)
                return response.status(400).send({ error: 'Product not found' });

            return response.json(product);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try { 
            const [count] = await knex('products').where({shop_id}).count();

            const product = await knex('products')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'code',
                    'description',
                    'value',
                    'amount',
                    'averageCost'
                )
                .orderBy('id', 'desc')
                .limit(30);

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(product);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        try {
            const shop_id = response.locals.jwtPayload.shop_id;

            const {
                name,
                code,
                description,
                value,
                amount,
                averageCost,
                category } = request.body;

            await knex('products').insert({
                name,
                code,
                description,
                value,
                amount,
                averageCost,
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
            code,
            description,
            value,
            amount,
            averageCost,
            category } = request.body;
        
        try {
            
            const product = await knex('products')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!product)
                return response.status(400).send({ error: 'Product not found' });

            if(product.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });


            await knex('products').where({id}).update({
                name,
                code,
                description,
                value,
                amount,
                averageCost,
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

            const product = await knex('products')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!product)
                return response.status(400).send({ error: 'Product not found' });

            if(product.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });

            await knex('products').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default ServicesController;