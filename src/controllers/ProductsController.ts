import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class ProductsController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const product = await knex('products')
                .where('products.shop_id', shop_id)
                .leftJoin('categorys','products.category_id','categorys.id')
                .select(
                    'products.id',
                    'products.name',
                    'products.code',
                    'products.description',
                    'products.value',
                    'products.amount',
                    'products.averageCost',
                    knex.raw('ifnull(categorys.name, "Não possui categoria") as category_name')
                )
                .orderBy('products.name')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(product.length === 0)
                return response.status(400).send({ error: 'Products not found' });

            return response.json(product);
            
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
                .where('products.shop_id', shop_id)
                .leftJoin('categorys','products.category_id','categorys.id')
                .select(
                    'products.id',
                    'products.name',
                    'products.code',
                    'products.description',
                    'products.value',
                    'products.amount',
                    'products.averageCost',
                    knex.raw('ifnull(categorys.name, "Não possui categoria") as category_name')
                )
                .orderBy('products.name')
                .andWhere('name', 'like', '%'+String(products)+'%')
                .orderBy('name');

            if(product.length === 0) {
                product = await knex('products')
                    .where('products.shop_id', shop_id)
                    .leftJoin('categorys','products.category_id','categorys.id')
                    .select(
                        'products.id',
                        'products.name',
                        'products.code',
                        'products.description',
                        'products.value',
                        'products.amount',
                        'products.averageCost',
                        knex.raw('ifnull(categorys.name, "Não possui categoria") as category_name')
                    )
                    .orderBy('products.name')
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
                .where('products.shop_id', shop_id)
                .leftJoin('categorys','products.category_id','categorys.id')
                .select(
                    'products.id',
                    'products.name',
                    'products.code',
                    'products.description',
                    'products.value',
                    'products.amount',
                    'products.averageCost',
                    knex.raw('ifnull(categorys.name, "Não possui categoria") as category_name')
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
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            name,
            code,
            description,
            value,
            amount,
            averageCost,
            category } = request.body;

        try {

            const category = await knex('categorys')
                .where({shop_id})
                .where({name})
                .first();

            if(category)
                return response.status(400).send({ error: 'Name already used' });

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

export default ProductsController;