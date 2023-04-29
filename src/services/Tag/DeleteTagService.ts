import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';
import { BadRequestError, NotFoundError } from '../../utils/CustomErrors';

class DeleteTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute(id: string) {
    if (!id) throw new BadRequestError('Empty tag id value');
    const deletedTag = await this.tagsRepository.delete(id);

    if (!deletedTag) throw new NotFoundError('Inexistent tag');
    return deletedTag;
  }
}

export { DeleteTagService };