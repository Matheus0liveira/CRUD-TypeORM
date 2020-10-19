import { Router } from 'express';
import  UserController  from './app/controllers/UserController';
import  AuthController  from './app/controllers/AuthController';

import authMiddleWare from './middlewares/auth';


const routes = Router();



routes.post('/session', AuthController.authenticate);


routes.get('/users', UserController.index);

routes.post('/users/create', UserController.create);

routes.delete('/users/delete', authMiddleWare, UserController.delete);
routes.put('/users/update', authMiddleWare, UserController.update);


export default routes;