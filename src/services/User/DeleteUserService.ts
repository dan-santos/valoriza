import { IUserRepository } from '../../repositories/User/UsersRepository.interface';

class DeleteUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute(id: string) {
    const deletedUser = await this.usersRepository.delete(id);

    return deletedUser;
  }
}

export { DeleteUserService };