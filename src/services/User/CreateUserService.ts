import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';
import { hashSync } from 'bcryptjs';

interface IUserRequestDTO {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
}

class CreateUserService {

  constructor (
    private usersRepository: IUserRepository
  ){}

  async execute({ name, email, admin = false, password }: IUserRequestDTO) {    
    if(!name || !email || !(typeof admin === 'boolean') || !password) {
      throw new BadRequestError('Empty name, email, admin or password value');
    }
    
    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) throw new BadRequestError('User already exists');

    const SALT_VALUE = 8;
    const passwordHash = hashSync(password, SALT_VALUE);

    const user = this.usersRepository.create({
      name,
      email,
      admin,
      password: passwordHash,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export { CreateUserService };