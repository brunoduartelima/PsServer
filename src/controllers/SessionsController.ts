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
                return response.status(400).json({ error: 'Nenhum usuário encontrado com este e-mail' });
            
            if(!await bcrypt.compare(password, user.password))
                return response.status(400).json({ error: 'Senha incorreta' });

            if(user.type !== 'master') {
                const employeeCheck = await knex('employees')
                    .where('id', user.employee_id)
                    .where('active', true)
                    .first();
            
                if(!employeeCheck)
                    return response.status(401).json({ error: 'Usuário com o acesso desabilitado' });
            }
            
            const companyName = await knex('shops')
                .where('id', user.shop_id)
                .select('companyName')
                .first();

            const token = jwt.sign({ user_id: user.id, shop_id: user.shop_id }, authConfig.secret, {
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
            
            const user = await knex('users')
                .where({email})
                .select(
                    'type',
                    'shop_id'
                )
                .first();

            if(!user)
                return response.status(400).send({ error: 'Falha ao tentar encontrar E-mail' });

            const token = crypto.randomBytes(10).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            const date = now.toLocaleString();

            await knex('users').where({email}).update({
                passwordResetToken: token,
                passwordResetExpires: date
            });

            if(user.type === 'regular'){
                
                const userMaster = await knex('users')
                    .where('shop_id', user.shop_id)
                    .andWhere('type', 'master')
                    .select('email')
                    .first();
    
                mailer.sendMail({
                    to: userMaster.email,
                    from: 'oi@psmanager.com.br',
                    subject: 'Recuperar senha',
                    html: `<p>Um de seus usuários esqueceu a senha? Não tem problema, utilize esse token: ${token}</p>`,
    
                }, (error) => {
                    if(error)
                        return response.status(400).send({ error: 'Não foi possível enviar um e-mail para trocar a senha' });
                });
                
            } else {
                
                mailer.sendMail({
                    to: email,
                    from: 'oi@psmanager.com.br',
                    subject: 'Recuperar senha',
                    html: `<p>Você esqueceu sua senha? Não tem problema, utilize esse token: ${token}</p>`,
    
                }, (error) => {
                    if(error)
                        return response.status(400).send({ error: 'Não foi possível enviar um e-mail para trocar a senha' });
                });
            }

            return response.send();

        } catch (error) {
            response.status(400).send({ error: 'Erro em "esqueci a senha", tente novamente' });
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
                return response.status(400).send({ error: 'Falha ao tentar encontrar E-mail' });
            
            if(token !== user.passwordResetToken)
                return response.status(400).send({ error: 'Token inválido' });
            
            const now = new Date().toLocaleString();

            if(now > user.passwordResetExpires)
                return response.status(400).send({ error: 'Token expirado, solicite um novo' });

            const hash = await bcrypt.hash(password, 10);

            await knex('users').where({email}).update({
                password: hash
            });

            return response.send();

            
        } catch (error) {
            response.status(400).send({ error: 'Erro em resetar a senha, tente novamente' });
            next(error);
        }
    }

}

export default SessionsController;