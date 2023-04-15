
import { Request, Response } from 'express';
import { TagsRepository } from '../repositories/Tag/TagsRepository';
import { CreateTagService } from '../services/Tag/CreateTagService';
import { GetTagsService } from '../services/Tag/GetTagsService';
import { UpdateTagService } from '../services/Tag/UpdateTagService';
import { CustomError } from '../utils/CustomErrors';

const tagsRepository = new TagsRepository();

export class TagController {
  async create(req: Request, res: Response) {
    const { name } = req.body;

    const tagService = new CreateTagService(tagsRepository);

    try {
      const tag = await tagService.execute({ name });
  
      return res.status(200).json(tag);
    } catch (e) {
      const err = e as CustomError;
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    const takeParam = req.query.take ?? null;
    const take = parseInt(takeParam as string);

    const tagService = new GetTagsService(tagsRepository);

    const tags = await tagService.execute({ take });

    return res.status(200).json(tags);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    
    if(!name || !id) return res.status(400).json('Empty tag name or id value');
    
    const tagService = new UpdateTagService(tagsRepository);
    
    const updatedTag = await tagService.execute({ id, name });
    if (!updatedTag) return res.status(404).json('Tag doesnt exist');

    return res.status(200).json(updatedTag);
  }
}