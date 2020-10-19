import {Request, Response} from 'express';

import bcrypt from 'bcryptjs';

import User from '../models/User';
import { getRepository } from 'typeorm';
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
        
        password: Yup.string().required(),

        confirmPassword: Yup.string().min(5)
        .required()
        .oneOf([Yup.ref('password')], 'ConfirmPass must equal password')
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
        return response.status(409).json({message: 'Password no match'})

      }




      
      
      return response.json({ok: true});
  }
  
}

export default new UserController;