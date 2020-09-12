import express from 'express';

import SessionsController from './controllers/SessionsController';
import ShopsController from './controllers/ShopsController';
import UsersController from './controllers/UsersController';
import ClientsController from './controllers/ClientsController';
import EmployeesController from './controllers/EmployeesController';
import ProductsController from './controllers/ProductsController';
import CategorysController from './controllers/CategorysController';
import ServicesController from './controllers/ServicesController';
import SalesController from './controllers/SalesController';
import CreditsController from './controllers/CreditsController';

import { checkJwt } from './middlewares/checkJwt';
import { checkTypeUser } from './middlewares/checkTypeUser';
import { checkCompatib } from './middlewares/checkCompatib';

const routes = express.Router();

const shopsController = new ShopsController();
const sessionsController = new SessionsController();
const clientsController = new ClientsController();
const usersController = new UsersController();
const employeesController = new EmployeesController();
const productsController = new ProductsController();
const categorysController = new CategorysController();
const servicesController = new ServicesController();
const salesController = new SalesController();
const creditsController = new CreditsController();

routes.get('/shops', [checkJwt, checkTypeUser(['master'])], shopsController.index);
routes.post('/shops', shopsController.create);
routes.put('/shops/:id', [checkJwt, checkTypeUser(['master'])], shopsController.update);

routes.post('/sessions', sessionsController.create);
routes.post('/sessions/forgot_password', sessionsController.forgotPassword);
routes.put('/sessions/reset_password', sessionsController.resetPassword);

routes.get('/users', [checkJwt, checkTypeUser(['master'])], usersController.index);
routes.post('/users', [checkJwt, checkTypeUser(['master'])], usersController.create);
routes.put('/users/:id', [checkJwt, checkCompatib], usersController.updatePassword);
routes.delete('/users/:id', [checkJwt, checkTypeUser(['master'])], usersController.delete);

routes.get('/clients/total', [checkJwt, checkCompatib], clientsController.index);
routes.get('/clients/search', [checkJwt, checkCompatib], clientsController.search);
routes.get('/clients', [checkJwt, checkCompatib], clientsController.lastetAdd);
routes.post('/clients', [checkJwt, checkCompatib], clientsController.create);
routes.put('/clients/:id', [checkJwt, checkCompatib], clientsController.update);
routes.delete('/clients/:id', [checkJwt, checkCompatib], clientsController.delete);

routes.get('/employees/total', [checkJwt, checkTypeUser(['master'])], employeesController.index);
routes.get('/employees/search', [checkJwt, checkTypeUser(['master'])], employeesController.search);
routes.get('/employees', [checkJwt, checkTypeUser(['master'])], employeesController.lastetAdd);
routes.post('/employees', [checkJwt, checkTypeUser(['master'])], employeesController.create);
routes.put('/employees/:id', [checkJwt, checkTypeUser(['master'])], employeesController.update);
routes.delete('/employees/:id', [checkJwt, checkTypeUser(['master'])], employeesController.delete);

routes.get('/products/total', [checkJwt, checkCompatib], productsController.index);
routes.get('/products/search', [checkJwt, checkCompatib], productsController.search);
routes.get('/products', [checkJwt, checkCompatib], productsController.lastetAdd);
routes.post('/products', [checkJwt, checkCompatib], productsController.create);
routes.put('/products/:id', [checkJwt, checkCompatib], productsController.update);
routes.delete('/products/:id', [checkJwt, checkCompatib], productsController.delete);

routes.get('/services/total', [checkJwt, checkCompatib], servicesController.index);
routes.get('/services/search', [checkJwt, checkCompatib], servicesController.search);
routes.get('/services', [checkJwt, checkCompatib], servicesController.lastetAdd);
routes.post('/services', [checkJwt, checkCompatib], servicesController.create);
routes.put('/services/:id', [checkJwt, checkCompatib], servicesController.update);
routes.delete('/services/:id', [checkJwt, checkCompatib], servicesController.delete);

routes.get('/categorys/total', [checkJwt, checkCompatib], categorysController.index);
routes.get('/categorys/search', [checkJwt, checkCompatib], categorysController.search);
routes.get('/categorys', [checkJwt, checkCompatib], categorysController.lastetAdd);
routes.post('/categorys', [checkJwt, checkCompatib], categorysController.create);
routes.put('/categorys/:id', [checkJwt, checkCompatib], categorysController.update);
routes.delete('/categorys/:id', [checkJwt, checkCompatib], categorysController.delete);

routes.post('/sales', [checkJwt, checkCompatib], salesController.create);
routes.get('/sales/total', [checkJwt, checkCompatib], salesController.index);
routes.get('/sales/:id', [checkJwt, checkCompatib], salesController.detail);
routes.put('/sales/:id', [checkJwt, checkCompatib], salesController.update);
routes.delete('/sales/:id', [checkJwt, checkCompatib], salesController.delete);

routes.get('/credits/total', [checkJwt, checkCompatib], creditsController.index);
routes.get('/credits/search', [checkJwt, checkCompatib], creditsController.search);
routes.post('/credits', [checkJwt, checkCompatib], creditsController.create);
routes.put('/credits/:id', [checkJwt, checkCompatib], creditsController.update);
routes.delete('/credits/:id', [checkJwt, checkCompatib], creditsController.delete);

export default routes;