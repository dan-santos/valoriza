import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { ForbiddenError } from '../../utils/CustomErrors';

interface IUserRequestDTO {
  id: string;
  user_id: string;
}
class DeleteUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ id, user_id }: IUserRequestDTO) {

    const userRequester = await this.usersRepository.findById(user_id);

    if (id === user_id  || userRequester.admin) {
      const deletedUser = await this.usersRepository.delete(id);
      return deletedUser;
    }
    throw new ForbiddenError('You cannot delete a user that is not you or without being admin');
  }
}

export { DeleteUserService };