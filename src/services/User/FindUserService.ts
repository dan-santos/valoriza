import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';

interface IUserRequestDTO {
  id?: string;
  email?: string;
}

class FindUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ id, email }: IUserRequestDTO): Promise<User> {
    if(!email && !id) throw new BadRequestError('Unable to find user');
    
    let user = null;
    if (email) {
      user = await this.usersRepository.findByEmail(email);
    } else {
      user = await this.usersRepository.findById(id);
    }

    return user;
  }
}

export { FindUserService };