import { Tag } from '../../entities/Tag';
import { prismaClient } from '../PrismaClient';
import { ITagRepository } from './TagsRepository.interface';

const client = prismaClient;

class TagsRepository implements ITagRepository {
  create(tag: Partial<Tag>): Tag {
    return new Tag({
      ...tag,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  save(tag: Tag): Promise<Tag> {
    return client.tag.create({
      data: tag
    });
  }

  get(take?: number): Promise<Tag[]> {
    if(take){
      return client.tag.findMany({take: take});
    }
    return client.tag.findMany();
  }
  
  findByName(name: string): Promise<Tag>{
    return client.tag.findFirst({
      where: {
        name: {
          equals: name
        },
      },
    });
  }
}

export { TagsRepository };