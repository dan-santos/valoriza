import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { ForbiddenError } from '../../utils/CustomErrors';

interface IComplimentRequestDTO {
  id: string;
  user_id: string;
}

class DeleteComplimentService {

  constructor (
    private complimentsRepository: IComplimentRepository
  ){}

  async execute({ id, user_id }: IComplimentRequestDTO) {

    const { user_sender } = await this.complimentsRepository.findById(id);

    if (user_sender !== user_id) throw new ForbiddenError('You cannot delete a compliment that you arent author');

    const deletedCompliment = await this.complimentsRepository.delete(id);

    return deletedCompliment;
  }
}

export { DeleteComplimentService };