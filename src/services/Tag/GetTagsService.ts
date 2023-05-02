import { Tag } from '../../entities/Tag';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

class GetTagsService {
  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute(take?: number): Promise<Tag[]>{
    const tags = this.tagsRepository.get(take);

    return tags;
  }
}

export { GetTagsService };