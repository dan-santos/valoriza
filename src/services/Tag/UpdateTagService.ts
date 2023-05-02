import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';
import { BadRequestError, NotFoundError } from '../../utils/CustomErrors';

interface ITagRequestDTO {
  id: string; 
  name: string;
}
class UpdateTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute({ id, name }: ITagRequestDTO) {
    if(!id || !name) throw new BadRequestError('Tag id or name cannot be empty or null');
    
    const tag = await this.tagsRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag is not exist');

    const updatedTag = await this.tagsRepository.update({ id, name });

    return updatedTag;
  }
}

export { UpdateTagService };