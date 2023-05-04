import { describe, it, expect } from 'vitest';
import { DeleteUserService } from './DeleteUserService';
import { User } from '../../entities/User';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from './CreateUserService';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

describe('When DeleteUserService is called', () => {
  it('should return User object if User is successfully deleted', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);
    const deletedUser = await deleteUserService.execute({id: user.id, user_id: user.id});

    expect(deletedUser).toBeInstanceOf(User);
  });

  it('should delete user if requester user is himself', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);
    const deletedUser = await deleteUserService.execute({id: user.id, user_id: user.id});

    expect(deletedUser).toBeInstanceOf(User);
  });

  it('should delete user if requester user is admin', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });
    const admin = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: true, password: '123' 
    });

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);
    const deletedUser = await deleteUserService.execute({id: user.id, user_id: admin.id});

    expect(deletedUser).toBeInstanceOf(User);
  });

  it.each([
    { id: null, user_id: 'non-empty' },
    { id: 'non-empty', user_id: null },
  ])('should return 400 Error if id or user_id is empty/null', (user) => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);

    expect(
      async () => {await deleteUserService.execute({id: user.id, user_id: user.user_id});}
    ).rejects.toThrow(BadRequestError);
  });

  it('should return 403 Error if requester user is not himself neither admin', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });
    const anotherUser = await createUserService.execute({ 
      name: 'anotherUser', email: 'anotheruser@mail.com', admin: false, password: '123' 
    });

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);

    expect(
      async () => {await deleteUserService.execute({id: user.id, user_id: anotherUser.id});}
    ).rejects.toThrow(ForbiddenError);
  });

  it('should return 404 Error if requester user doesnt exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const user = await createUserService.execute({ 
      name: 'john', email: 'jon@mail.com', admin: false, password: '123' 
    });

    const deleteUserService = new DeleteUserService(inMemoryUsersRepository);

    expect(
      async () => {await deleteUserService.execute({id: user.id, user_id: 'inexistentId'});}
    ).rejects.toThrow(NotFoundError);
  });
});