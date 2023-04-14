import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';

interface IPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {                        
  const bearerToken = req.headers.authorization;

  if (!bearerToken) return res.status(401).json('Unauthorized User');
  const [,token] = bearerToken.split(' '); // Bearer xpto123...
  
  try {
    const { sub } = verify(token, config.jsonwebtoken.key) as IPayload;

    req.user_id = sub;
    return next();

  } catch (e) {
    return res.status(401).json('Unauthorized User');
  }
}