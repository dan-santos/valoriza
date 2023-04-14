import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';

interface IUserRequestDTO {
  take?: number
}

class GetUsersService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ take }: IUserRequestDTO): Promise<User[]> {
    const users = this.usersRepository.get(take);

    return users;
  }
}

export { GetUsersService };