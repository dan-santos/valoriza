import { User } from '../entities/User';
import { IUserRepository } from '../repositories/User/UsersRepository.interface';
import { AuthenticateUserService } from '../services/User/AuthenticateUserService';
import { CreateUserService } from '../services/User/CreateUserService';

// this function are used in E2E tests
export async function getAdminToken(usersRepository: IUserRepository): Promise<string> {
  const adminModel = new User({ name: 'AdminTestUser', email: 'admin@test.com', admin: true, password: '123' });
  const createUserService = new CreateUserService(usersRepository);

  const admin = await createUserService.execute(adminModel);

  const authService = new AuthenticateUserService(usersRepository);
  const bearerToken = await authService.execute({ email: admin.email, password: adminModel.password });

  return bearerToken;
}

// this function are used in E2E tests
export async function getCommonToken(usersRepository: IUserRepository): Promise<string> {
  const userModel = new User({ name: 'CommonTestUser', email: 'common@test.com', password: '123' });
  const createUserService = new CreateUserService(usersRepository);

  const user = await createUserService.execute(userModel);

  const authService = new AuthenticateUserService(usersRepository);
  const bearerToken = await authService.execute({ email: user.email, password: userModel.password });

  return bearerToken;
}