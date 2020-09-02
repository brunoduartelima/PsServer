import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import knex from '../database/connection';

class UsersController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;

        try {

            const users = await knex('users')
                .join('employees','users.employee_id','employees.id')
                .where('users.shop_id', shop_id)
                .select(
                    'users.id',
                    'employees.name',
                    'users.email'
                );

            return response.json(users);

        } catch (error) {
            next(error);   
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { email, password, employee_id } = request.body;

        try {

            const [ amountUsers ] = await knex('users')
                .where({shop_id})
                .count();
            
            if(amountUsers['count(*)'] >= 4)
                return response.status(400).send({ error: 'The maximum user limit has been reached' });

            const user = await knex('users')
                .where({email}).orWhere({employee_id})
                .first();
            
            if(user)
                return response.status(400).send({ error: 'E-mail already in use or employee already is user' });
            
            const employee = await knex('employees')
                .where('id', employee_id)
                .select('active')
                .first();

            if(employee.active === 0)
                return response.status(400).send({ error: 'Employee is deactivated' });    

            const hash = await bcrypt.hash(password, 10);

            await knex('users').insert({
                email,
                password: hash,
                type: 'regular',
                employee_id,
                shop_id
            });

            return response.status(201).send();
            
        } catch (error) {
            next(error)
        }
    }
    
    async updatePassword (request: Request, response: Response, next: NextFunction) {
        const { password, newPassword } = request.body;

        const { id } = request.params;

        const { user_id, shop_id } = response.locals.jwtPayload;  

        try {

                if(user_id != id)
                    return response.status(401).send({ error: 'Operation not permitted' });

                const user = await knex('users')
                    .where({id})
                    .where({shop_id})
                    .select('password')
                    .first();

                if(!user)
                    return response.status(400).send({ error: 'Failed to change password, try again' });
                
                if(!await bcrypt.compare(password, user.password))
                    return response.status(400).json({ error: 'Invalid password' });

                const hash = await bcrypt.hash(newPassword, 10);
                
                await knex('users').where({id}).update({
                    password: hash
                });

                return response.status(200).send();

        } catch (error) {
            next(error);
        }
    }

    async delete (request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
            
        const shop_id = response.locals.jwtPayload.shop_id;
        
        try {

            const user = await knex('users')
                .where({id})
                .where({shop_id})
                .select('type')
                .first();
            
            if(!user || user.type === 'master')
                return response.status(401).send({ error: 'Operation not permitted' });
            
            await knex('users').where({id}).delete();

            return response.status(200).send();

        } catch (error) {
            next(error);
        }
    }
}

export default UsersController;