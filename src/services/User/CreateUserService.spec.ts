import { describe, it, expect } from 'vitest';
import { CreateUserService } from './CreateUserService';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { User } from '../../entities/User';
import { BadRequestError } from '../../utils/CustomErrors';

describe('When CreateUserService is called', () => {
  it('should return User object if is he successfully created', async () => {
    const createUserService = new CreateUserService(new InMemoryUsersRepository());
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jon@mail.com',
      admin: true,
      password: '123'
    });
    expect(user).toBeInstanceOf(User);
  });

  it('should create non-admin User by default if admin param is implicit', async () => {
    const createUserService = new CreateUserService(new InMemoryUsersRepository());
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jon@mail.com',
      password: '123'
    });
    expect(user.admin).toStrictEqual(false);
  });

  it.each([
    { name: null, email: 'jon@mail.com', admin: false, password: '123' },
    { name: 'John Doe', email: null, admin: true, password: '123' },
    { name: 'John Doe', email: 'jon@mail.com', admin: null, password: null },
    { name: '', email: '', admin: null, password: '' }
  ])('should return 400 Error if some required fields are null or empty', (user) => {
    const createUserService = new CreateUserService(new InMemoryUsersRepository());
    expect(async () => {await createUserService.execute(user);}).rejects.toThrow(BadRequestError);
  });

  it('should return 400 Error if user email is already exists in database', async () => {
    const createUserService = new CreateUserService(new InMemoryUsersRepository());
    const mockedUser = {
      name: 'John Doe',
      email: 'jon@mail.com',
      admin: true,
      password: '123'
    };
    await createUserService.execute(mockedUser);
    expect(async () => {await createUserService.execute(mockedUser);}).rejects.toThrow(BadRequestError);
  });
});