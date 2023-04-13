import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { UnauthorizedError } from '../../utils/CustomErrors';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

interface IAuthenticateRequestDTO {
  email: string;
  password: string;
}

class AuthenticateUserService {
  constructor(
    private usersRepository: IUserRepository
  ){}
  async execute({ email, password }: IAuthenticateRequestDTO) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const passwordsMatch = compareSync(password, user.password);
    if (!passwordsMatch) throw new UnauthorizedError('Incorrect email or password');

    const token = sign({
      email: user.email
    }, config.jsonwebtoken.key, {
      subject: user.id,
      expiresIn: config.jsonwebtoken.ttl
    });

    return token;
  }
}

export { AuthenticateUserService };