import { it, describe, expect } from 'vitest';
import { CreateComplimentService } from './CreateComplimentService';
import { Compliment } from '../../entities/Compliment';
import { InMemoryComplimentsRepository } from '../../tests/repositories/InMemoryComplimentsRepository';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from '../User/CreateUserService';
import { CreateTagService } from '../Tag/CreateTagService';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

describe('When create compliment service is called', async () => {
  it('should return Compliment object if is he successfully created', async () => {
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

    const compliment = await createComplimentService.execute({ 
      tag_id: tag.id, user_sender: sender.id, user_receiver: receiver.id, message: 'This is dummy message'
    });

    expect(compliment).toBeInstanceOf(Compliment);
  });

  it('should return 403 Error if user try to send compliment to himself', async () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, new InMemoryUsersRepository(), new InMemoryTagsRepository()
    );

    expect(async() => {
      await createComplimentService.execute({ 
        tag_id: 'mockedId', 
        user_sender: 'mockedId', 
        user_receiver: 'mockedId', 
        message: 'mockedMessage'
      });
    }).rejects.toThrow(ForbiddenError);
  });

  it.each([
    { tag_id: 'mockedId', user_sender: 'mockedId', user_receiver: 'mockedId', message: null},
    { tag_id: 'mockedId', user_sender: 'mockedId', user_receiver: null, message: 'This is dummy message'},
    { tag_id: 'mockedId', user_sender: null, user_receiver: 'mockedId', message: 'This is dummy message'},
    { tag_id: null, user_sender: 'mockedId', user_receiver: 'mockedId', message: 'This is dummy message'},
  ])('should return 400 Error if any of required fields are empty/null', (compliment) => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, new InMemoryUsersRepository(), new InMemoryTagsRepository()
    );

    expect(async() => {
      await createComplimentService.execute({ 
        ...compliment
      });
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 404 Error if user receiver is not exists', async () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, inMemoryUsersRepository, new InMemoryTagsRepository()
    );

    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const sender = await createUserService.execute({ 
      name: 'sender', email: 's@mail.com', admin: false, password: '123' 
    });

    expect(async() => {
      await createComplimentService.execute({ 
        tag_id: 'mockedId', 
        user_sender: sender.id, 
        user_receiver: 'receiverMockedId', 
        message: 'mockedMessage'
      });
    }).rejects.toThrow(NotFoundError);
  });

  it('should return 404 Error if user sender is not exists', async () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, inMemoryUsersRepository, new InMemoryTagsRepository()
    );

    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const receiver = await createUserService.execute({ 
      name: 'receiver', email: 'r@mail.com', admin: false, password: '123' 
    });

    expect(async() => {
      await createComplimentService.execute({ 
        tag_id: 'mockedId', 
        user_sender: 'senderMockedId', 
        user_receiver: receiver.id, 
        message: 'mockedMessage'
      });
    }).rejects.toThrow(NotFoundError);
  });

  it('should return 404 Error if Tag is not exists', async () => {
    const inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createComplimentService = new CreateComplimentService(
      inMemoryComplimentsRepository, inMemoryUsersRepository, inMemoryTagsRepository
    );

    const createUserService = new CreateUserService(inMemoryUsersRepository);
    const receiver = await createUserService.execute({ 
      name: 'receiver', email: 'r@mail.com', admin: false, password: '123' 
    });
    const sender = await createUserService.execute({ 
      name: 'sender', email: 's@mail.com', admin: false, password: '123' 
    });

    expect(async() => {
      await createComplimentService.execute({ 
        tag_id: 'mockedId', 
        user_sender: sender.id, 
        user_receiver: receiver.id, 
        message: 'mockedMessage'
      });
    }).rejects.toThrow(NotFoundError);
  });
});