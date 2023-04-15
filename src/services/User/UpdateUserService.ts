import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';

class UpdateUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute(user: Partial<User>) {
    const updatedUser = await this.usersRepository.update(user);

    return updatedUser;
  }
}

export { UpdateUserService };