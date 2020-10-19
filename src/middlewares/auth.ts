import { Request, Response, NextFunction, response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayLoad{


  id: number;
  iat: number;
  exp: number;
}

const authMiddleWare = (request: Request, response: Response, next : NextFunction) => {


  const { authorization } = request.headers;



  if(!authorization){
    return response.status(401).json({ message: 'Token not provider'});
  }



  const token = authorization.replace('Bearer', ' ').trim();


  try{

    const data = jwt.verify(token, 'SECRET_PASSWORD-DO_NOT_SHARE');
 
    const { id } = data as TokenPayLoad;

    request.userId = id;

    next();
  }catch {

    return response.status(401).json({message: 'Unauthorized'});
  };

};



export default authMiddleWare;