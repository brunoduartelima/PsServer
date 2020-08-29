import { Request, Response, NextFunction } from 'express';
import knex from '../database/connection';

export const checkTypeUser = (type: Array<string>) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const { user_id, shop_id } = response.locals.jwtPayload;

        const user = await knex('users')
            .where('id', user_id)
            .where({shop_id})
            .select('type')
            .first();
        
        if(!user)
            return response.status(401).send({ error: 'Operation not permitted' });

        if (type.indexOf(user.type) > -1)
            next();
        else 
            return response.status(401).send({ error: 'User without permitted' });
    }
};