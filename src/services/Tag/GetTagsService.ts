import { Tag } from '../../entities/Tag';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

interface IRequestTagDTO {
  take?: number;
}

class GetTagsService {
  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute({ take }: IRequestTagDTO): Promise<Tag[]>{
    const tags = this.tagsRepository.get(take);

    return tags;
  }
}

export { GetTagsService };