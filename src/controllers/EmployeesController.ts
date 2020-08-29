import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class EmployeesController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {
            
            const [count] = await knex('employees').where({shop_id}).count();

            const employee = await knex('employees')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'salary',
                    'dateBirth',
                    'whatsapp',
                    'active'
                )
                .orderBy('name')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(employee.length === 0)
                return response.status(409).send({ error: 'Employees not found' });
            
            response.header('X-Total-Count', count['count(*)']);

            return response.json(employee);
            
        } catch (error) {
            next(error);
        }
    }

    async search (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { name } = request.query;

        try {

            const employee = await knex('employees')
                .where({shop_id})
                .select(
                    'id',
                    'name',
                    'salary',
                    'dateBirth',
                    'whatsapp',
                    'active'
                )
                .andWhere('name', 'like', '%'+String(name)+'%')
                .orderBy('name');

            if(employee.length === 0)
                return response.status(400).send({ error: 'Employee not found' });

            return response.json(employee);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try { 
            const [count] = await knex('employees').where({shop_id}).count();

            const employee = await knex('employees')
                .where({ shop_id })
                .select(
                    'id',
                    'name',
                    'salary',
                    'dateBirth',
                    'whatsapp',
                    'active'
                )
                .orderBy('id', 'desc')
                .limit(30);
            
            if(!employee)
                return response.status(409).send({ error: 'Employees not found' });

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(employee);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        try {
            const shop_id = response.locals.jwtPayload.shop_id;

            const {
                name,
                salary,
                dateBirth,
                whatsapp,
                active } = request.body;

            await knex('employees').insert({
                name,
                salary,
                dateBirth,
                whatsapp,
                active,
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
            salary,
            dateBirth,
            whatsapp,
            active } = request.body;
        
        try {
            
            const employee = await knex('employees')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!employee)
                return response.status(400).send({ error: 'Employee not found' });

            if(employee.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });


            await knex('employees').where({id}).update({
                name,
                salary,
                dateBirth,
                whatsapp,
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

            const employee = await knex('employees')
                .where({shop_id})
                .where({id})
                .select('shop_id')
                .first();
            
            if(!employee)
                return response.status(400).send({ error: 'Employee not found' });

            if(employee.shop_id !== shop_id)
                return response.status(401).send({ error: 'Operation not permitted' });

            await knex('employees').where({id}).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default EmployeesController;