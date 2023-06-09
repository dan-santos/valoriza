import { Request, Response } from 'express';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { AuthenticateUserService } from '../services/User/AuthenticateUserService';
import { CreateUserService } from '../services/User/CreateUserService';
import { DeleteUserService } from '../services/User/DeleteUserService';
import { GetUsersService } from '../services/User/GetUsersService';
import { UpdateUserService } from '../services/User/UpdateUserService';
import { CustomError } from '../utils/CustomErrors';

const usersRepository = new UsersRepository();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userService = new CreateUserService(usersRepository);

    try {
      const user = await userService.execute({ name, email, password });
  
      return res.status(200).json(user);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  async auth(req: Request, res: Response) {
    const { email, password } = req.body;

    const authUserService = new AuthenticateUserService(usersRepository);

    try {
      const token = await authUserService.execute({
        email,
        password
      });
  
      return res.status(200).json(token);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    const takeParam = req.query.take ?? null;
    const take = parseInt(takeParam as string);

    const userService = new GetUsersService(usersRepository);

    const users = await userService.execute(take);

    return res.status(200).json(users);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id } = req;
    const { name, email, admin } = req.body;
    
    if(!user_id || !name || !id || !email || !(typeof admin === 'boolean')) {
      return res.status(400).json('Empty user_id or user name, email, admin or id value');
    }

    const userService = new UpdateUserService(usersRepository);
    
    try {
      const updatedUser = await userService.execute({ id, name, email, admin, user_id });
      if (!updatedUser) return res.status(404).json('User doesnt exist');
  
      return res.status(200).json(updatedUser);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { user_id } = req;
    const { id } = req.params;
    
    if(!id || !user_id) return res.status(400).json('Empty user id or user_id value');
    
    const userService = new DeleteUserService(usersRepository);
    
    try {
      const deletedUser = await userService.execute({ id, user_id });
      if (!deletedUser) return res.status(404).json('User doesnt exist');
  
      return res.status(200).json(deletedUser);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }
}