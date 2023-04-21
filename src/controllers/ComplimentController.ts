
import { Request, Response } from 'express';
import { ComplimentsRepository } from '../repositories/Compliment/ComplimentsRepository';
import { TagsRepository } from '../repositories/Tag/TagsRepository';
import { UsersRepository } from '../repositories/User/UsersRepository';
import { CreateComplimentService } from '../services/Compliment/CreateComplimentService';
import { DeleteComplimentService } from '../services/Compliment/DeleteComplimentService';
import { GetComplimentsService } from '../services/Compliment/GetComplimentsService';
import { ListUserReceiveComplimentsService } from '../services/Compliment/ListUserReceiveComplimentsService';
import { ListUserSendComplimentsService } from '../services/Compliment/ListUserSendComplimentsService';
import { UpdateComplimentService } from '../services/Compliment/UpdateComplimentService';
import { CustomError } from '../utils/CustomErrors';

const complimentsRepository = new ComplimentsRepository();
const usersRepository = new UsersRepository();
const tagsRepository = new TagsRepository();

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

  async get(req: Request, res: Response) {
    const takeParam = req.query.take ?? null;
    const take = parseInt(takeParam as string);

    const complimentService = new GetComplimentsService(complimentsRepository);

    const compliments = await complimentService.execute({ take });

    return res.status(200).json(compliments);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id } = req;
    const { tag_id, message } = req.body;
    
    if(!tag_id || !id || !message) return res.status(400).json('Empty compliment tag, message or id value');
    
    const complimentService = new UpdateComplimentService(complimentsRepository, tagsRepository);
    
    try {
      const updatedCompliment = await complimentService.execute({ id, tag_id, message, user_id });
      if (!updatedCompliment) return res.status(404).json('Compliment doesnt exist');
  
      return res.status(200).json(updatedCompliment);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id } = req;
    
    if(!id) return res.status(400).json('Empty compliment id value');
    
    const complimentService = new DeleteComplimentService(complimentsRepository);
    
    try {
      const deletedCompliment = await complimentService.execute({ id, user_id });
      if (!deletedCompliment) return res.status(404).json('Compliment doesnt exist');
  
      return res.status(200).json(deletedCompliment);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }
}