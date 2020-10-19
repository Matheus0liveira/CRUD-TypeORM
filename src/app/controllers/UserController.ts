import {Request, Response} from 'express';

import bcrypt from 'bcryptjs';

import User from '../models/User';
import { getRepository,  getManager } from 'typeorm';
import * as Yup from 'yup';


class UserController{


  async create(request: Request, response: Response){

    const userRepository = getRepository(User);


    const {
      name,
      email,
      password,
    } = request.body;


    const emailExists = await userRepository.findOne({where: { email}});

    if(emailExists){
      return response.status(409).json({message: 'Email already exists!'});
    }

    const data = {
      name,
      email,
      password,
      
    };
    
    const schema = Yup.object().shape({

      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(5).required(),
    })
    
    
    
    await schema.validate(data, { abortEarly: false}).catch(err => {
      const {errors} = err;
      return response.status(400).json({errors});
    });
    
    
    const user = userRepository.create(data);
    await userRepository.save(user);
    
    
    
    
    response.json({ok: true});
    
  }
  
  async delete(request: Request, response: Response){
    
    const { email, password, confirmPassword } = request.body;
      const data = {email, password, confirmPassword};
      
      
      const userRepository = getRepository(User);
      
      
      const schema = Yup.object().shape({
        
        email: Yup.string().email().required(),

        password: Yup.string().required()
        .oneOf([Yup.ref('confirmPassword')], null),

        confirmPassword: Yup.string().min(5)
        .required()
        .oneOf([Yup.ref('password')],
          () => response.json({message: 'Password not match'})
        )
      });
      

      await schema.validate(data, {abortEarly: false}).catch(err => {
        const { errors } = err;
        return response.status(400).json({errors});
      });

      
      const emailExists = await userRepository.findOne({where: { email}});

      if(!emailExists){
      return response.status(409).json({message: 'Email not exists!'});

      }


      const verifyPassword = await bcrypt.compare(password, emailExists.password);


      if(!verifyPassword){
        return response.status(409).json({message: 'Password not match'});

      }
      await userRepository.remove(emailExists);

      return response.sendStatus(200);
  }


  async update(request: Request, response: Response){
    const userRepository =  getManager().getRepository(User);

    const id  = request.userId;

    const {

      name, email, newPassword, oldPassword, password

    } = request.body;


    
    const data = { 
      
      name, 
      email, 
      newPassword, 
      oldPassword, 
      password 
      
    }
    
    
    const schema = Yup.object().shape({
      
      name: Yup.string(), 
      email: Yup.string(), 
      oldPassword: Yup.string(),
      newPassword: Yup.string(),
      password: Yup.string().required()
      
    });


    const emailExists = await userRepository.findOne({where: { email}});
    
    if(emailExists){
      return response.status(409).json({message: 'Email already exists'});
      
    }
    
    const user = await userRepository.findOne(id);

      

    const verifyPassword = await bcrypt.compare(password, user.password);

    if(!verifyPassword){
      return response.json({message: 'Incorrect Password'});
    };



    if(oldPassword && oldPassword !== newPassword || newPassword && oldPassword !== newPassword ){

      return response.status(400).json({message: 'Passwords not match' });
    }


    await schema.validate(data, { abortEarly: false}).catch(err => {


      const { errors } = err;
      return response.status(400).json({message: errors });
      
    });


    const dataUpdate = {
      name: name ||  user.name,
      email: email ||  user.email,
      password: bcrypt.hashSync(newPassword, 10) ||  user.password,
    }



    await userRepository.update({ id }, dataUpdate );

    const updateUser = await userRepository.findOne(id);


    return response.json(updateUser);

    
  


  }
};

export default new UserController;