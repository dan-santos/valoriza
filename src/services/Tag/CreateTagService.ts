import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';

interface ITagRequestDTO {
  name: string;
}

class CreateTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute({ name }: ITagRequestDTO) {    
    if(!name) throw new BadRequestError('Empty tag name value');
    
    const tagAlreadyExists = await this.tagsRepository.findByName(name);
    if (tagAlreadyExists) throw new BadRequestError('Tag already exists');

    const tag = this.tagsRepository.create({ name });

    await this.tagsRepository.save(tag);

    return tag;
  }
}

export { CreateTagService };