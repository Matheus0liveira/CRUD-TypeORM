import { Response, Request} from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import User from '../models/User';

import UserView from '../View/UserView';

import * as Yup from 'yup';
import jwt from 'jsonwebtoken';


class AuthController {

  async authenticate(request: Request, response: Response){
    const UserRepository = getRepository(User);


    const { email, password } = request.body;


    const schema = Yup.object().shape({

      email: Yup.string().email().required(),
      password: Yup.string().required(),
      
    });
    const data  = { email, password };

    await schema.validate(data, { abortEarly: false}).catch(err => {
      const { errors } = err;
      return response.status(401).json({message: errors});
    });



    const user = await UserRepository.findOne({where: { email }});

    if(!user){
      return response.status(404).json({message: 'Email not found'});
    }


    const validPassword = await bcrypt.compare(password, user.password);


    if(!validPassword){
      return response.status(401).status(404).json({message: 'Password not match'});
    }


    const token = jwt.sign({id: user.id},
       'SECRET_PASSWORD-DO_NOT_SHARE',
        { expiresIn: '1d'});


  
  
        
  return response.status(200).json({ user: UserView.render(user), token });


  }


};

export default new AuthController;