import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

class DeleteTagService {

  constructor (
    private tagsRepository: ITagRepository
  ){}

  async execute(id: string) {
    const deletedTag = await this.tagsRepository.delete(id);

    return deletedTag;
  }
}

export { DeleteTagService };