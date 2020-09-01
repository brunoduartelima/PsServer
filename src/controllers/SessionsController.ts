import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import knex from '../database/connection';

import mailer from '../modules/mailer';

const authConfig = require('../config/auth');

class SessionsController {
    async create (request: Request, response: Response, next: NextFunction) {
        const { email , password } = request.body;
        
        try {

            const user = await knex('users')
                .where({email})
                .select('password')
                .select('id')
                .select('shop_id')
                .select('employee_id')
                .select('type')
                .first();

            if(!user)
                return response.status(400).json({ error: 'No USER found with this email' });
            
            if(!await bcrypt.compare(password, user.password))
                return response.status(400).json({ error: 'Invalid password' }); 
            
            if(user.employee_id !== null) {
                const employeeId = user.employee_id;

                const employeeCheck = await knex('employees')
                    .where('id', employeeId)
                    .where('active', true)
                    .first();
                
                if(!employeeCheck)
                    return response.status(401).json({ error: 'User is inactive on the server' });
            }

            const shop_id = user.shop_id;

            const companyName = await knex('shops')
                .where('id', shop_id)
                .select('companyName')
                .first();

            const token = jwt.sign({ user_id: user.id, shop_id: shop_id }, authConfig.secret, {
                    expiresIn: "1h",
                });

            return response.status(201).json({
                companyName: companyName.companyName, 
                token
            });

        } catch (error) {
            next(error)
        }
    }

    async forgotPassword (request: Request, response: Response, next: NextFunction) {
        const { email } = request.body;

        try {
            
            const user = await knex('users').where({email}).first();

            if(!user)
                return response.status(400).send({ error: 'User not found' });

            const token = crypto.randomBytes(10).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

           const date = now.toLocaleString();

            await knex('users').where({email}).update({
                passwordResetToken: token,
                passwordResetExpires: date
            });

            mailer.sendMail({
                to: email,
                from: 'oi@psmanager.com.br',
                subject: 'Recuperar senha',
                html: `<p>Você esqueceu sua senha? Não tem problema, utilize esse token: ${token}</p>`,

            }, (error) => {
                if(error)
                    return response.status(400).send({ error: 'Cannot send forgot password email' });
            });

            return response.send();

        } catch (error) {
            response.status(400).send({ error: 'Erro on forgot password, try again' });
            next(error);
        }
    }

    async resetPassword (request: Request, response: Response, next: NextFunction) {
        const { email, token, password } = request.body;

        try {
            const user = await knex('users')
                .where({email})
                .select('passwordResetToken', 'passwordResetExpires')
                .first();

            if(!user)
                return response.status(400).send({ error: 'User not found' });
            
            if(token !== user.passwordResetToken)
                return response.status(400).send({ error: 'Token invalid' });
            
            const now = new Date().toLocaleString();

            if(now > user.passwordResetExpires)
                return response.status(400).send({ error: 'Token expired, generate a new one' });

            const hash = await bcrypt.hash(password, 10);

            await knex('users').where({email}).update({
                password: hash
            });

            return response.send();

            
        } catch (error) {
            response.status(400).send({ error: 'Erro on reset password, try again' });
            next(error);
        }
    }

}

export default SessionsController;