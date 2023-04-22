import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

interface ITagRequestDTO {
  id: string; 
  name: string;
}
class UpdateTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute({ id, name }: ITagRequestDTO) {
    const updatedTag = await this.tagsRepository.update({ id, name });

    return updatedTag;
  }
}

export { UpdateTagService };