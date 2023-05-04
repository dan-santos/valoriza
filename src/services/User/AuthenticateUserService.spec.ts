import { describe, it, expect } from 'vitest';
import { AuthenticateUserService } from './AuthenticateUserService';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from './CreateUserService';
import { BadRequestError, UnauthorizedError } from '../../utils/CustomErrors';

describe('When authentication service is called', () => {
  it('should return token if User exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });

    const authService = new AuthenticateUserService(inMemoryUsersRepository);
    const token = await authService.execute({ email: user.email, password: '123' });
    
    expect(token).toBeTruthy();
  });

  it.each([
    { email: null, password: 'non-empty' },
    { email: 'non-empty', password: null },
  ])('should return 400 Error if email or password is empty/null', async (user) => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const authService = new AuthenticateUserService(inMemoryUsersRepository);
    
    expect(async () => {
      await authService.execute({ email: user.email, password: user.password });
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 401 Error if User doesnt exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const authService = new AuthenticateUserService(inMemoryUsersRepository);
    
    expect(async () => {
      await authService.execute({ email: 'inexistentEmail', password: '123' });
    }).rejects.toThrow(UnauthorizedError);
  });

  it('should return 401 Error if incorrect password is passed as param', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });

    const authService = new AuthenticateUserService(inMemoryUsersRepository);
    
    expect(async () => {
      await authService.execute({ email: user.email, password: 'anotherPassword' });
    }).rejects.toThrow(UnauthorizedError);
  });
});