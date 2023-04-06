
import { Request, Response } from 'express';
import { TagsRepository } from '../repositories/Tag/TagsRepository';
import { CreateTagService } from '../services/Tag/CreateTagService';

const tagsRepository = new TagsRepository();

export class TagController {
  async create(req: Request, res: Response) {
    const { name } = req.body;

    const tagService = new CreateTagService(tagsRepository);

    const tag = await tagService.execute({ name });

    return res.status(200).json(tag);
  }
}