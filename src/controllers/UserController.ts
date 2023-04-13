import { Request, Response } from 'express';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { CreateUserService } from '../services/User/CreateUserService';

const usersRepository = new UsersRepository();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, admin, password } = req.body;

    const userService = new CreateUserService(usersRepository);

    const user = await userService.execute({ name, email, admin, password });

    return res.status(200).json(user);
  }
}