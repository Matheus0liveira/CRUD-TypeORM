import { Router } from 'express';
import  UserController  from './app/controllers/UserController';



const routes = Router();



routes.get('/', UserController.create);
routes.get('/delete', UserController.delete);


export default routes;