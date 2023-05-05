import { it, describe, expect, beforeEach } from 'vitest';
import { CreateComplimentService } from './CreateComplimentService';
import { DeleteComplimentService } from './DeleteComplimentService';
import { Compliment } from '../../entities/Compliment';
import { InMemoryComplimentsRepository } from '../../tests/repositories/InMemoryComplimentsRepository';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { InMemoryUsersRepository } from '../../tests/repositories/InMemoryUsersRepository';
import { CreateUserService } from '../User/CreateUserService';
import { CreateTagService } from '../Tag/CreateTagService';
import { User } from '../../entities/User';
import { Tag } from '../../entities/Tag';
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

describe('When delete compliment service is called', () => {
  it('should delete Compliment if the User requester is author', async() => {
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);
    const deletetedCompliment = await deleteComplimentService.execute({ id: compliment.id, user_id: sender.id });

    expect(deletetedCompliment).toBeInstanceOf(Compliment);
  });

  it('should delete Compliment if the User requester is admin', async() => {
    const admin = await createUserService.execute({ 
      name: 'admin', email: 'admin@mail.com', admin: true, password: '123' 
    });
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);
    const deletetedCompliment = await deleteComplimentService.execute({ id: compliment.id, user_id: admin.id });

    expect(deletetedCompliment).toBeInstanceOf(Compliment);
  });

  it('should return 403 Error if user requester is not author neither admin', async() => {
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);

    expect(async() => {
      await deleteComplimentService.execute({ id: compliment.id, user_id: receiver.id });
    }).rejects.toThrow(ForbiddenError);
  });

  it.each([
    { id: null, user_id: 'non-empty' },
    { id: 'non-empty', user_id: null }
  ])('should return 400 Error if any of required field is empty/null', async(data) => {
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);

    expect(async() => {
      await deleteComplimentService.execute({ id: data.id, user_id: data.user_id });
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 404 Error if user requester is not exists', async() => {
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);

    expect(async() => {
      await deleteComplimentService.execute({ id: compliment.id, user_id: 'mockedId' });
    }).rejects.toThrow(NotFoundError);
  });

  it('should return 404 Error if compliment is not exists', async() => {
    const deleteComplimentService = new DeleteComplimentService(inMemoryComplimentsRepository, inMemoryUsersRepository);

    expect(async() => {
      await deleteComplimentService.execute({ id: 'mockedId', user_id: sender.id });
    }).rejects.toThrow(NotFoundError);
  });
});