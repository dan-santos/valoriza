import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { ForbiddenError } from '../../utils/CustomErrors';

interface IUserRequestDTO {
  id: string;
  name: string;
  email: string;
  admin?: boolean;
  user_id: string;
}

class UpdateUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({id, name, email, admin, user_id}: IUserRequestDTO) {
    const userRequester = await this.usersRepository.findById(user_id);
    let updatedUser;

    // if the requested is admin, he can change admin property of user
    if (userRequester.admin) {
      updatedUser = await this.usersRepository.update({
        id,
        name,
        email,
        admin
      });
    // if the requester is not admin, he can change only your own properties, except "admin" attribute
    } else if (id === user_id) {
      updatedUser = await this.usersRepository.update({
        id,
        name,
        email
      });
    } else {
      throw new ForbiddenError('You cannot update a user that is not you or without being admin');
    }

    return updatedUser;
  }
}

export { UpdateUserService };