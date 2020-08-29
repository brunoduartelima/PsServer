import { Request, Response, NextFunction } from 'express';
import knex from '../database/connection';

export const checkCompatib = 
    async (request: Request, response: Response, next: NextFunction) => {
        const { user_id, shop_id } = response.locals.jwtPayload;

        const user =  await knex('users')
            .where('id', user_id)
            .where({shop_id})
            .first();
        
        if(!user)
            return response.status(401).send({ error: 'Operation not permitted' });
        else
            next();
}