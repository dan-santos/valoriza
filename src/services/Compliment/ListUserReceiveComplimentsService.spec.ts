import { it, describe, expect } from 'vitest';
import { CreateComplimentService } from './CreateComplimentService';
import { InMemoryComplimentsRepository } from '../../tests/repositories/InMemoryComplimentsRepository';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from '../User/CreateUserService';
import { CreateTagService } from '../Tag/CreateTagService';
import { ListUserReceiveComplimentsService } from './ListUserReceiveComplimentsService';
import { BadRequestError } from '../../utils/CustomErrors';

describe('When list user received compliments service is called', () => {
  it('should return list with all compliments sent for the user requester', async() => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const inMemoryUsersRepository = new InMemoryUsersRepository();
  
    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const createTagService = new CreateTagService(inMemoryTagsRepository);
  
    const sender = await createUserService.execute({ 
      name: 'sender', email: 's@mail.com', admin: false, password: '123' 
    });
    const receiver = await createUserService.execute({ 
      name: 'receiver', email: 'r@mail.com', admin: false, password: '123' 
    });
    const anotherUser = await createUserService.execute({ 
      name: 'anotherUser', email: 'another@mail.com', admin: false, password: '123' 
    });
  
    const tag = await createTagService.execute({ name: 'mockedTag' });

    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, inMemoryUsersRepository, inMemoryTagsRepository
    );
    const expectedNumberOfCompliments = 5;
    for (let index = 0; index < expectedNumberOfCompliments; index++) {
      await createComplimentService.execute({ 
        tag_id: tag.id, user_sender: sender.id, user_receiver: receiver.id, message: 'This is dummy message'
      });
    }
    await createComplimentService.execute({ 
      tag_id: tag.id, user_sender: receiver.id, user_receiver: anotherUser.id, message: 'This is dummy message'
    });
    // i.e. not all compliments are from the receiver

    const listComplimentsService = new ListUserReceiveComplimentsService(inMemoryComplimentsRepository);
    const complimentsReceived = await listComplimentsService.execute(receiver.id);

    expect(complimentsReceived.length).toStrictEqual(expectedNumberOfCompliments);
  });

  it('should return 400 Error if user_id is empty/null', () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const listComplimentsService = new ListUserReceiveComplimentsService(inMemoryComplimentsRepository);

    expect(async() => {
      await listComplimentsService.execute(null);
    }).rejects.toThrow(BadRequestError);
  });

  it('should return empty list if user_id doesnt exists', async () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const listComplimentsService = new ListUserReceiveComplimentsService(inMemoryComplimentsRepository);
    const compliments = await listComplimentsService.execute('inexistentUser');
    expect(compliments).toStrictEqual([]);
  });
});