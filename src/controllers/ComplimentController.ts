
import { Request, Response } from 'express';
import { ComplimentsRepository } from '../repositories/Compliment/ComplimentsRepository';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { CreateComplimentService } from '../services/Compliment/CreateComplimentService';
import { ListUserReceiveComplimentsService } from '../services/Compliment/ListUserReceiveComplimentsService';
import { ListUserSendComplimentsService } from '../services/Compliment/ListUserSendComplimentsService';
import { CustomError } from '../utils/CustomErrors';

const complimentsRepository = new ComplimentsRepository();
const usersRepository = new UsersRepository();

export class ComplimentController {
  async create(req: Request, res: Response) {
    const { tag_id, user_receiver, message } = req.body;

    const complimentService = new CreateComplimentService(
      complimentsRepository,
      usersRepository
    );

    try {
      const compliment = await complimentService.execute({ 
        tag_id, 
        user_sender: req.user_id, 
        user_receiver, 
        message 
      });
      return res.status(200).json(compliment);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }

  }

  async listByUser(req: Request, res: Response) {
    const { user_id } = req;
    const senderComplimentService = new ListUserSendComplimentsService(complimentsRepository);
    const receiverComplimentService = new ListUserReceiveComplimentsService(complimentsRepository);

    const complimentsSent = await senderComplimentService.execute(user_id);
    const complimentsReceived = await receiverComplimentService.execute(user_id);

    return res.status(200).json({
      'received': complimentsReceived,
      'sent': complimentsSent
    });
  } 
}