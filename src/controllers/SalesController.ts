import { Request, Response, NextFunction } from 'express';

import knex from '../database/connection';

class SalesController {
    async index (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { page = 1 } = request.query;
        
        try {

            const sale = await knex('sales')
                .where({shop_id})
                .join('clients','sales.client_id','clients.id')
                .select(
                    'sales.id',
                    'sales.type',
                    knex.raw('ifnull(sales.description, "não possui") as description'),
                    'sales.value',
                    'sales.descont',
                    'sales.date',
                    'clients.name',
                )
                .orderBy('date')
                .limit(30)
                .offset((Number(page) - 1) * 30);

            if(sale.length === 0)
                return response.status(400).send({ error: 'Sales not found' });

            return response.json(sale);
            
        } catch (error) {
            next(error);
        }
    }

    async detail (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { id } = request.params;

        try {

            const sale = await knex('sales')
                .where({id}).andWhere({shop_id})
                .first();

            if(!sale)
                return response.status(400).send({ error: 'Venda não encontrada, tente novamente.' });

            const product  = await knex('products')
                .join('products_sales', 'products.id', 'products_sales.product_id')
                .where('products_sales.sale_id', Number(id))
                .select(
                    'products.name as product_name',
                    'products_sales.amount as product_amount'
                );

            const service  = await knex('services')
                .join('services_sales', 'services.id', 'services_sales.service_id')
                .where('services_sales.sale_id', Number(id))
                .select(
                    'services.name as service_name',
                    'services_sales.amount as service_amount'
                    );

            const employee  = await knex('employees')
                .join('employees_sales', 'employees.id', 'employees_sales.employee_id')
                .where('employees_sales.sale_id', Number(id))
                .select(
                    'employees.name as employee_name',
                    'employees_sales.commission'
                );

            return response.json({ product, service, employee });
            
        } catch (error) {
            next(error);
        }
    }

    async search (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        const { client } = request.query;

        try {

            const sale = await knex('sales')
                .where({shop_id})
                .first();

            if(!sale)
                return response.status(400).send({ error: 'Venda não encontrada, tente novamente' });

            const clientSale = await knex('sales')
                .join('clients','sales.client_id','clients.id')
                .select(
                    'sales.id',
                    'sales.type',
                    knex.raw('ifnull(sales.description, "não possui") as description'),
                    'sales.value',
                    'sales.descont',
                    'sales.date',
                    'clients.name',
                )
                .where({shop_id})
                .andWhere('clients.name', 'like', '%'+String(client)+'%')
                .orderBy('clients.name')
                .limit(30);

            if(clientSale.length === 0)
                    return response.status(400).send({ error: 'Cliente não encontrado'});


            return response.json(clientSale);
            
        } catch (error) {
            next(error);
        }
    }

    async lastetAdd (request: Request, response: Response, next: NextFunction) {
        const shop_id =  response.locals.jwtPayload.shop_id;
        
        try { 
            
            const [count] = await knex('sales').where({shop_id}).count();

            const sale = await knex('sales')
                .where({shop_id})
                .join('clients','sales.client_id','clients.id')
                .select(
                    'sales.id',
                    'sales.type',
                    knex.raw('ifnull(sales.description, "não possui") as description'),
                    'sales.value',
                    'sales.descont',
                    'sales.date',
                    'clients.name',
                )
                .orderBy('date')
                .limit(30);

            response.header('X-Total-Count', count['count(*)']); 

            return response.json(sale);
            
        } catch (error) {
            next(error);
        }
    }

    async create (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;

        const {
            type,
            description,
            value,
            descont,
            date,
            client_id,
            products,
            services,
            employees } = request.body;

        try {

            const checkClient = await knex('shops_clients')
                .where({shop_id}).andWhere({client_id})
                .first();
            
            if(!checkClient)
                return response.status(400).send({ error: 'Este cliente não está cadastrado, tente novamente.' });

            const trx = await knex.transaction();

            const insertedId = await trx('sales').insert({
                type,
                description,
                value,
                descont,
                date,
                client_id,
                shop_id
            });

            const sale_id = insertedId[0];

            const employeeItems = employees.map((employee: any) => {
                return {
                    commission: employee.commission,
                    employee_id: employee.employee_id,
                    sale_id
                }
            });

            await trx('employees_sales').insert(employeeItems);

            if(products[0] != null) {
                const productItems = products.map((product: any) => {
                    return {
                        product_id: product.product_id,
                        amount: product.amount,
                        sale_id
                    }
                });

                await trx('products_sales').insert(productItems);
            }

            if(services[0] != null) {
                const serviceItems = services.map((service: any) => {
                    return {
                        service_id: service.service_id,
                        amount: service.amount,
                        sale_id
                    }
                });

                await trx('services_sales').insert(serviceItems);
            }

            await trx.commit();

            response.status(201).json({
                client_id,
                sale_id
            });

        } catch (error) {
            next(error)
        }
    }

    async update (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;

        const {
            type,
            description,
            value,
            descont,
            date,
            client_id,
            products,
            services,
            employees } = request.body;

        const sale = await knex('sales')
            .where({shop_id}).andWhere({id})
            .first();
        
        if(!sale)
            return response.status(400).send({ error: 'Venda não encontrada' });


        const checkClient = await knex('shops_clients')
            .where({shop_id}).andWhere({client_id})
            .first();
        
        if(!checkClient)
            return response.status(400).send({ error: 'Este cliente não está cadastrado, tente novamente.' });

        const trx = await knex.transaction();
        
        try {

            await trx('sales').where({id}).update({
                type,
                description,
                value,
                descont,
                date,
                client_id,
                shop_id
            });

            await trx('products_sales').where('sale_id', id).delete();

            await trx('employees_sales').where('sale_id', id).delete();
            
            await trx('services_sales').where('sale_id', id).delete();

            const employeeItems = employees.map((employee: any) => {
                return {
                    commission: employee.commission,
                    employee_id: employee.employee_id,
                    sale_id: id
                }
            });

            await trx('employees_sales').where('sale_id', id).insert(employeeItems);

            if(products[0] != null) {
                const productItems = products.map((product: any) => {
                    return {
                        product_id: product.product_id,
                        amount: product.amount,
                        sale_id: id
                    }
                });

                await trx('products_sales').where('sale_id', id).insert(productItems);
            }

            if(services[0] != null) {
                const serviceItems = services.map((service: any) => {
                    return {
                        service_id: service.service_id,
                        amount: service.amount,
                        sale_id: id
                    }
                });

                await trx('services_sales').where('sale_id', id).insert(serviceItems);
            }

            await trx.commit();

            response.status(201).json({
                client_id,
                sale_id: id
            });

        } catch (error) {
            
            await trx.rollback();
            
            response.status(400).send({ error: 'Erro inesperado ao editar a venda' });
            
            next(error)
        }
    }

    async delete (request: Request, response: Response, next: NextFunction) {
        const shop_id = response.locals.jwtPayload.shop_id;
        const { id } = request.params;
        
        try {

            const sale = await knex('sales')
                .where({id}).andWhere({shop_id})
                .first();

            if(!sale)
                return response.status(400).send({ error: 'Venda não encontrada' });

            await knex('sales').where({id}).delete();

            await knex('products_sales').where('sale_id', id).delete();

            await knex('employees_sales').where('sale_id', id).delete();
            
            await knex('services_sales').where('sale_id', id).delete();

            response.status(200).send();

        } catch (error) {
            next(error)
        }
    }
}

export default SalesController;