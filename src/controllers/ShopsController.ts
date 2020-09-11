import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import knex from '../database/connection';
const authConfig = require('../config/auth');

class ShopsController {
    async index (request: Request, response: Response, next: NextFunction) {
        try {
            const shop = await knex('shops').select('*');
    
            return response.json(shop)

        } catch (error) {
            next(error)
        }
        
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const {  
            name,  
            phone, 
            cpf, 
            companyName, 
            companyType, 
            uf,
            city,
            email,
            password } = request.body;

        try {
            
            const checkCpf = await knex('shops').where({cpf}).first();
            
            if(checkCpf)
                return response.status(400).send({ error: 'Este CPF já está cadastrado' });

            const checkEmail = await knex('users').where({email}).first();

            if(checkEmail)
                return response.status(400).send({ error: 'Este e-mail já está em uso' });

            const shop = {
                name,
                phone,
                companyName, 
                companyType, 
                uf,
                city,
            };

            const generateId = crypto.randomBytes(4).toString('hex');
            
            const hash = await bcrypt.hash(password, 10);

            const trx = await knex.transaction();
            
            await trx('shops').insert({
                id: generateId,
                name,
                phone,
                cpf,
                companyName,
                companyType,
                uf,
                city
            });

            const insertedIdEmployee = await trx('employees').insert({
                name,
                salary: 0,
                dateBirth: "2000-01-01",
                whatsapp: phone,
                active: true,
                shop_id: generateId
            });

            const employee_id = insertedIdEmployee[0];

            const userId = await trx('users').insert({
                email,
                password: hash,
                type: 'master',
                shop_id: generateId,
                employee_id
            });

            await trx.commit();

            const id = userId[0];

            const token = jwt.sign({ user_id: id, shop_id: generateId }, authConfig.secret, {
                expiresIn: "1h",
            });

            return response.json({
                ...shop,
                token
            });

        } catch (error) {
            next(error)
        }
        
    }

    async update (request: Request, response: Response, next: NextFunction) {
        const {  
            name,  
            phone, 
            companyName, 
            companyType, 
            uf,
            city } = request.body;
        
        const { id } = request.params;
        
        const shop_id = response.locals.jwtPayload.shop_id;

        try {

            if(shop_id != id)
                return response.status(401).send({ error: 'Operação não permitida' });
            
            await knex('shops').where({id}).update({
                name,  
                phone,
                companyName,
                companyType,
                uf,
                city
            });

            return response.status(200).send();

        } catch (error) {
            next(error);
        }
    }
}

export default ShopsController;