import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { FindUserService } from '../services/User/FindUserService';

export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const { user_id } = req;

  if(!user_id) return res.status(400).json('Missing "userId" attribute');

  const usersRepository = new UsersRepository();
  const findUserService = new FindUserService(usersRepository);

  const { admin } = await findUserService.execute({ id: user_id });

  if (!admin) return res.status(403).json('User not enough privileges');
  
  return next();
}