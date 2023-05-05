import { it, describe, expect, beforeEach } from 'vitest';
import { CreateComplimentService } from './CreateComplimentService';
import { Compliment } from '../../entities/Compliment';
import { InMemoryComplimentsRepository } from '../../tests/repositories/InMemoryComplimentsRepository';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from '../User/CreateUserService';
import { CreateTagService } from '../Tag/CreateTagService';
import { User } from '../../entities/User';
import { Tag } from '../../entities/Tag';
import { UpdateComplimentService } from './UpdateComplimentService';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

let inMemoryTagsRepository: InMemoryTagsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryComplimentsRepository: InMemoryComplimentsRepository;

let createUserService: CreateUserService;
let createTagService: CreateTagService;
let createComplimentService: CreateComplimentService;

let sender: User;
let receiver: User;
let tag: Tag;
let compliment: Compliment;

beforeEach(async() => {
  inMemoryTagsRepository = new InMemoryTagsRepository();
  inMemoryUsersRepository = new InMemoryUsersRepository();

  createUserService = new CreateUserService(inMemoryUsersRepository);
  createTagService = new CreateTagService(inMemoryTagsRepository);

  sender = await createUserService.execute({ 
    name: 'sender', email: 's@mail.com', admin: false, password: '123' 
  });
  receiver = await createUserService.execute({ 
    name: 'receiver', email: 'r@mail.com', admin: false, password: '123' 
  });

  tag = await createTagService.execute({ name: 'mockedTag' });

  inMemoryComplimentsRepository = new InMemoryComplimentsRepository();
  createComplimentService = new CreateComplimentService(
    inMemoryComplimentsRepository, inMemoryUsersRepository, inMemoryTagsRepository
  );

  compliment = await createComplimentService.execute({ 
    tag_id: tag.id, user_sender: sender.id, user_receiver: receiver.id, message: 'This is dummy message'
  });
});

describe('when update compliment service is called', () => {
  it('should update Compliment if User requester is author', async() => {
    const updateComplimentService = new UpdateComplimentService(inMemoryComplimentsRepository, inMemoryTagsRepository);
    const updatedCompliment = await updateComplimentService.execute({ 
      id: compliment.id, tag_id: tag.id, message: 'Updated Compliment', user_id: sender.id 
    });
    expect(updatedCompliment).toBeInstanceOf(Compliment);
  });

  it('should update Compliment if tag id of compliment is updated', async() => {
    const updateComplimentService = new UpdateComplimentService(inMemoryComplimentsRepository, inMemoryTagsRepository);
    
    const anotherTag = await createTagService.execute({ name: 'anotherTag' });

    const updatedCompliment = await updateComplimentService.execute({ 
      id: compliment.id, tag_id: anotherTag.id, message: 'Updated Compliment', user_id: sender.id 
    });

    expect(updatedCompliment).toBeInstanceOf(Compliment);
  });

  it('should return 403 Error if User requester is not author (not even if he is admin)', async () => {
    const updateComplimentService = new UpdateComplimentService(inMemoryComplimentsRepository, inMemoryTagsRepository);
    
    expect(async () => {
      await updateComplimentService.execute({ 
        id: compliment.id, tag_id: tag.id, message: 'Updated Compliment', user_id: receiver.id 
      });
    }).rejects.toThrow(ForbiddenError);

    const admin = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: true, password: '123' 
    });

    expect(async () => {
      await updateComplimentService.execute({ 
        id: compliment.id, tag_id: tag.id, message: 'Updated Compliment', user_id: admin.id 
      });
    }).rejects.toThrow(ForbiddenError);
  });

  it.each([
    { id: 'mockedId', tag_id: 'mockedId', message: 'Updated Compliment', user_id: null },
    { id: 'mockedId', tag_id: 'mockedId', message: null, user_id: 'mockedId' },
    { id: 'mockedId', tag_id: null, message: 'Updated Compliment', user_id: 'mockedId' },
    { id: null, tag_id: 'mockedId', message: 'Updated Compliment', user_id: 'mockedId' },
  ])('should return 400 Error if any of required fields are empty/null', (data) => {
    const updateComplimentService = new UpdateComplimentService(inMemoryComplimentsRepository, inMemoryTagsRepository);
    
    expect(async () => {
      await updateComplimentService.execute({ 
        ...data
      });
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 404 Error if updated Tag Id is not exists', async () => {
    const updateComplimentService = new UpdateComplimentService(inMemoryComplimentsRepository, inMemoryTagsRepository);
    
    expect(async () => {
      await updateComplimentService.execute({ 
        id: compliment.id, tag_id: 'inexistentTag', message: 'Updated Compliment', user_id: sender.id 
      });
    }).rejects.toThrow(NotFoundError);
  });
});