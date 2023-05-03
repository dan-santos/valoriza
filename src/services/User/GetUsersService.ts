import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';

class GetUsersService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute(take?: number): Promise<User[]> {
    const users = this.usersRepository.get(take);

    return users;
  }
}

export { GetUsersService };