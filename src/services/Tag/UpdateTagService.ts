import { Tag } from '../../entities/Tag';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

class UpdateTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute(tag: Partial<Tag>) {
    const updatedTag = await this.tagsRepository.update(tag);

    return updatedTag;
  }
}

export { UpdateTagService };