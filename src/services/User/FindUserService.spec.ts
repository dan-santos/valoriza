import { describe, it, expect } from 'vitest';
import { CreateUserService } from './CreateUserService';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { User } from '../../entities/User';
import { FindUserService } from './FindUserService';
import { BadRequestError, NotFoundError } from '../../utils/CustomErrors';

describe('When FindUserService is called', () => {
  it('should return User object if his ID exist in database', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jon@mail.com',
      admin: true,
      password: '123'
    });

    const findUserService = new FindUserService(inMemoryUsersRepository);
    const foundUser = await findUserService.execute({ id: user.id });

    expect(foundUser).toBeInstanceOf(User);
  });

  it('should return User object if his email is exist in database', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jon@mail.com',
      admin: true,
      password: '123'
    });

    const findUserService = new FindUserService(inMemoryUsersRepository);
    const foundUser = await findUserService.execute({ email: user.email });

    expect(foundUser).toBeInstanceOf(User);
  });

  it('should return User object if his ID is exist in database', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'jon@mail.com',
      admin: true,
      password: '123'
    });

    const findUserService = new FindUserService(inMemoryUsersRepository);
    const foundUser = await findUserService.execute({ email: user.email });

    expect(foundUser).toBeInstanceOf(User);
  });

  it('should return 404 Error if User is not found in database', () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const findUserService = new FindUserService(inMemoryUsersRepository);

    expect(async () => {await findUserService.execute({ email: 'inexistentEmail' });}).rejects.toThrow(NotFoundError);
  });

  it.each([
    { email: null, id: null },
    { email: '', id: '' },
  ])('should return 400 Error if email and ID params is null or empty', (user) => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const findUserService = new FindUserService(inMemoryUsersRepository);

    expect(async () => {await findUserService.execute(user);}).rejects.toThrow(BadRequestError);
  });
});