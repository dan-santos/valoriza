import { describe, it, expect } from 'vitest';
import { CreateUserService } from './CreateUserService';
import { UpdateUserService } from './UpdateUserService';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';
import { User } from '../../entities/User';

describe('When update user service is called', () => {
  it('should return User updated object if "user_id" attr belongs to User admin', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const adminUser = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: true, password: '123' 
    });
    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);
    const updatedUser = await updateUserService.execute({ 
      name: 'john updated', email: 'john.updated@mail.com', admin: false, id: mockedUser.id, user_id: adminUser.id 
    });

    expect(updatedUser).toBeInstanceOf(User);
  });

  it('should return User updated object if "user_id" attr belongs to himself', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);
    const updatedUser = await updateUserService.execute({ 
      name: 'john updated', email: 'john.updated@mail.com', admin: false, id: mockedUser.id, user_id: mockedUser.id 
    });

    expect(updatedUser).toBeInstanceOf(User);
  });

  it('should return User object with update_at attr different from created_at attr', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    await delay(10);

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);
    const updatedUser = await updateUserService.execute({ 
      name: 'john updated', email: 'john.updated@mail.com', admin: false, id: mockedUser.id, user_id: mockedUser.id 
    });

    expect(updatedUser.updated_at).not.toStrictEqual(updatedUser.created_at);
  });

  it('should return 403 Error if "user_id" attr belongs to a non-admin User and not belongs to himself', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const notAdminUser = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: false, password: '123' 
    });
    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);

    expect(async () => {
      await updateUserService.execute({ 
        name: 'john updated', email: 'john.updated@mail.com', admin: false, id: mockedUser.id, user_id: notAdminUser.id 
      });
    }).rejects.toThrow(ForbiddenError);
  });

  it('should return 404 Error if User is not found in database', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);

    expect(async () => {
      await updateUserService.execute({ 
        name: 'unknown john', email: 'john.guest@mail.com', admin: false, id: 'mockedId', user_id: 'mockedId' 
      });
    }).rejects.toThrow(NotFoundError);
  });

  it.each([
    { name: '', email: 'john.guest@mail.com', admin: false, id: 'mockedId', user_id: 'mockedId' },
    { name: 'john guest', email: '', id: 'mockedId', user_id: 'mockedId' },
    { name: 'john guest', email: 'john.guest@mail.com', id: '', user_id: 'mockedId' },
    { name: 'john guest', email: 'john.guest@mail.com', admin: false, id: 'mockedId', user_id: '' }
  ])('should return 400 Error if any of required params is null or empty', async (user) => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);

    expect(async () => {
      await updateUserService.execute(user);
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 409 Error if email of to be updated User is already in use', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    await createUserService.execute({ 
      name: 'doe', email: 'another@mail.com', admin: false, password: '123' 
    });

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);

    expect(async () => {
      await updateUserService.execute({ 
        name: 'john updated', email: 'another@mail.com', admin: false, id: mockedUser.id, user_id: mockedUser.id 
      });
    }).rejects.toThrow(ConflictError);
  });

  it('should update User "admin" attr ONLY IF user requester is admin', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);

    const adminUser = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: true, password: '123' 
    });
    const mockedUser = await createUserService.execute({ 
      name: 'john', email: 'john@mail.com', admin: false, password: '123' 
    });

    const updateUserService = new UpdateUserService(inMemoryUsersRepository);
    let updatedUser = await updateUserService.execute({ 
      name: 'john updated', email: 'john.updated@mail.com', admin: true, id: mockedUser.id, user_id: mockedUser.id 
    });

    expect(updatedUser.admin).toStrictEqual(false);

    updatedUser = await updateUserService.execute({ 
      name: 'john updated', email: 'john@mail.com', admin: true, id: mockedUser.id, user_id: adminUser.id 
    });

    expect(updatedUser.admin).toStrictEqual(true);
  });
});

function delay(milliseconds: number){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}