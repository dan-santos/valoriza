import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

interface IComplimentRequestDTO {
  id: string;
  tag_id: string;
  user_id: string;
  message: string;
}

class UpdateComplimentService {

  constructor (
    private complimentsRepository: IComplimentRepository,
    private tagsRepository: ITagRepository
  ){}

  async execute({ id, tag_id, user_id, message }: IComplimentRequestDTO) {
    if (!id || !tag_id || !user_id || !message) {
      throw new BadRequestError('id, tag_id, user_id or message cannot be empty/null');
    }

    const toBeUpdatedCompliment = await this.complimentsRepository.findById(id);

    if (!toBeUpdatedCompliment) throw new NotFoundError('Compliment doesnt exists');

    if (toBeUpdatedCompliment.user_sender !== user_id){
      throw new ForbiddenError('You cannot update a compliment that you arent author');
    }

    const refferedTag = await this.tagsRepository.findById(tag_id);

    if (!refferedTag) throw new NotFoundError('The reffered tag doesnt exists');

    const updatedCompliment = await this.complimentsRepository.update({ id, tag_id, message });

    return updatedCompliment;
  }
}

export { UpdateComplimentService };