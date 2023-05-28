import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

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
    if(!id || !name || !email || !user_id) throw new BadRequestError('id, name, email or user_id cannot be empty/null');

    const userRequester = await this.usersRepository.findById(user_id);
    if (!userRequester) throw new NotFoundError('User requester not found in database');

    let updatedUser: User;

    const toBeUpdatedUser = await this.usersRepository.findById(id);

    if (toBeUpdatedUser.email !== email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);
      if (userWithSameEmail) throw new ConflictError(`The email "${email}" is already in use`);
    }

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
    if (!updatedUser) throw new NotFoundError('User to be updated not found in database');
    return updatedUser;
  }
}

export { UpdateUserService };