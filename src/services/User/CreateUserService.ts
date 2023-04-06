import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';

interface IUserRequestDTO {
  name: string;
  email: string;
  admin?: boolean;
}

class CreateUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ name, email, admin }: IUserRequestDTO) {    
    if(!email) throw new BadRequestError('Empty email value');
    
    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) throw new BadRequestError('User already exists');

    const user = this.usersRepository.create({
      name,
      email,
      admin
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export { CreateUserService };