import { describe, it, expect } from 'vitest';
import { GetUsersService } from './GetUsersService';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from './CreateUserService';

describe('When GetUsersService is called', () => {
  it('should return empty list object if no users created', async () => {
    const getUserService = new GetUsersService(new InMemoryUsersRepository());

    const users = await getUserService.execute();
    expect(users).toStrictEqual([]);
  });

  it.each([1, 2, 3])('should return list of N users if take param assumes N value', async (take) => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    await createUserService.execute({ name: 'john', email: 'john@mail.com', admin: false, password: '123' });
    await createUserService.execute({ name: 'doe', email: 'doe@mail.com', admin: false, password: '123' });
    await createUserService.execute({ name: 'dee', email: 'dee@mail.com', admin: false, password: '123' });

    const getUserService = new GetUsersService(inMemoryUsersRepository);

    const users = await getUserService.execute(take);
    expect(users.length).toStrictEqual(take);
  });
});