
import { Request, Response } from 'express';
import { TagsRepository } from '../repositories/Tag/TagsRepository';
import { CreateTagService } from '../services/Tag/CreateTagService';
import { GetTagsService } from '../services/Tag/GetTagsService';

const tagsRepository = new TagsRepository();

export class TagController {
  async create(req: Request, res: Response) {
    const { name } = req.body;

    const tagService = new CreateTagService(tagsRepository);

    const tag = await tagService.execute({ name });

    return res.status(200).json(tag);
  }

  async get(req: Request, res: Response) {
    const takeParam = req.query.take ?? null;
    const take = parseInt(takeParam as string);

    const tagService = new GetTagsService(tagsRepository);

    const tags = await tagService.execute({ take });

    return res.status(200).json(tags);
  }
}