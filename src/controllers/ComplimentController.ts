
import { Request, Response } from 'express';
import { ComplimentsRepository } from '../repositories/Compliment/ComplimentsRepository';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { CreateComplimentService } from '../services/Compliment/CreateComplimentService';

const complimentsRepository = new ComplimentsRepository();
const usersRepository = new UsersRepository();

export class ComplimentController {
  async create(req: Request, res: Response) {
    const { tag_id, user_receiver, message } = req.body;

    const complimentService = new CreateComplimentService(
      complimentsRepository,
      usersRepository
    );

    const compliment = await complimentService.execute({ 
      tag_id, 
      user_sender: req.user_id, 
      user_receiver, 
      message 
    });

    return res.status(200).json(compliment);
  }
}