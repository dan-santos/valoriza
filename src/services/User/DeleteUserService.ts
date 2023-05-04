import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

interface IUserRequestDTO {
  id: string;
  user_id: string;
}
class DeleteUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ id, user_id }: IUserRequestDTO) {

    if (!id || !user_id) throw new BadRequestError('id and user_id cannot be empty/null');

    const userRequester = await this.usersRepository.findById(user_id);

    if (!userRequester) throw new NotFoundError('User request doesnt exists');

    if (id === user_id  || userRequester.admin) {
      const deletedUser = await this.usersRepository.delete(id);

      if (!deletedUser) throw new NotFoundError('User to be deleted doesnt exists');

      return deletedUser;
    }
    throw new ForbiddenError('You cannot delete a user that is not you or without being admin');
  }
}

export { DeleteUserService };