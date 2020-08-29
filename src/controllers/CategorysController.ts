import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class CategorysController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const category = await knex('categorys')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'description'
                )
                .orderBy('name')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(category.length === 0)
                return response.status(400).send({ error: 'Categorys not found' });

            return response.json(category);
            
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

            const category = await knex('categorys')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'description'
                )
                .andWhere('name', 'like', '%'+String(name)+'%')
                .orderBy('name');

            if(category.length === 0)
                return response.status(400).send({ error: 'Category not found' });

            return response.json(category);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try { 
            const [count] = await knex('categorys').where({shop_id}).count();

            const category = await knex('categorys')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'description'
                )
                .orderBy('id', 'desc')
                .limit(30);

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(category);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            name,
            description } = request.body;

        try {

            await knex('categorys').insert({
                name,
                description,
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
            description } = request.body;
        
        try {
            
            const category = await knex('categorys')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!category)
                return response.status(400).send({ error: 'Category not found' });

            if(category.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });


            await knex('categorys').where({id}).update({
                name,
                description
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

            const category = await knex('categorys')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!category)
                return response.status(400).send({ error: 'Category not found' });

            if(category.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });

            await knex('categorys').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default CategorysController;