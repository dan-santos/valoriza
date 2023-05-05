import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

interface IComplimentRequestDTO {
  id: string;
  user_id: string;
}

class DeleteComplimentService {

  constructor (
    private complimentsRepository: IComplimentRepository,
    private usersRepository: IUserRepository
  ){}

  async execute({ id, user_id }: IComplimentRequestDTO) {
    if(!id || !user_id) throw new BadRequestError('id or user_id cannot be empty/null');

    const complimentToBeDeleted = await this.complimentsRepository.findById(id);
    const userRequester = await this.usersRepository.findById(user_id);

    if (!complimentToBeDeleted) throw new NotFoundError('Compliment is not exist');
    if (!userRequester) throw new NotFoundError('User requester is not exist');

    if (complimentToBeDeleted.user_sender !== user_id && !userRequester.admin) {
      throw new ForbiddenError('You cannot delete a compliment that is not your own and without being an admin');
    } 
    const deletedCompliment = await this.complimentsRepository.delete(id);

    return deletedCompliment;
  }
}

export { DeleteComplimentService };