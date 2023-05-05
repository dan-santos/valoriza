import { it, describe, expect } from 'vitest';
import { CreateComplimentService } from './CreateComplimentService';
import { InMemoryComplimentsRepository } from '../../tests/repositories/InMemoryComplimentsRepository';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from '../User/CreateUserService';
import { CreateTagService } from '../Tag/CreateTagService';
import { GetComplimentsService } from './GetComplimentsService';

describe('When get compliments service is called', () => {
  it('should return empty list if no Compliments are created', async() => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const getComplimentsService = new GetComplimentsService(inMemoryComplimentsRepository);

    const compliments = await getComplimentsService.execute();
    expect(compliments).toStrictEqual([]);
  });

  it.each([1, 2, 3])('should return list of N compliments if take param assumes N value', async (take) => {
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
  
    const tag = await createTagService.execute({ name: 'mockedTag' });

    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, inMemoryUsersRepository, inMemoryTagsRepository
    );

    for (let index = 0; index < 3; index++) {
      await createComplimentService.execute({ 
        tag_id: tag.id, user_sender: sender.id, user_receiver: receiver.id, message: 'This is dummy message'
      });
    }
    
    const getComplimentsService = new GetComplimentsService(inMemoryComplimentsRepository);

    const compliments = await getComplimentsService.execute(take);
    expect(compliments.length).toStrictEqual(take);
  });
});