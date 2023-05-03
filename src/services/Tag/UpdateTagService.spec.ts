import { describe, it, expect } from 'vitest';
import { CreateTagService } from './CreateTagService';
import { UpdateTagService } from './UpdateTagService';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { BadRequestError, ConflictError, NotFoundError } from '../../utils/CustomErrors';
import { Tag } from '../../entities/Tag';

describe('When update tag service is called', () => {
  it('should return Tag object if tag is successfully updated', async () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createTagService = new CreateTagService(inMemoryTagsRepository);
    const createdTag = await createTagService.execute({ name: 'mockedTag' });

    const updateTagService = new UpdateTagService(inMemoryTagsRepository);
    const updatedTag = await updateTagService.execute({ id: createdTag.id, name: 'Updated mockedTag' });

    expect(updatedTag).toBeInstanceOf(Tag);
  });

  it('should return Tag object with update_at attr different from created_at attr', async () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createTagService = new CreateTagService(inMemoryTagsRepository);
    const createdTag = await createTagService.execute({ name: 'mockedTag' });

    await delay(1);

    const updateTagService = new UpdateTagService(inMemoryTagsRepository);
    const updatedTag = await updateTagService.execute({ ...createdTag, name: 'Updated mockedTag' });

    expect(updatedTag.updated_at).not.toStrictEqual(updatedTag.created_at);
  });

  it('should return 404 Error if tag is not exist', () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const updateTagService = new UpdateTagService(inMemoryTagsRepository);

    expect(async () => {
      await updateTagService.execute({id: 'InexistentId', name: 'InexistentTag'});
    }).rejects.toThrow(NotFoundError);
  });

  it.each([
    {id: null, name: 'non-empty'},
    {id: 'non-empty', name: null},
    {id: null, name: null},
  ])('should return 400 Error if tag id or name value is empty/null', async (tag) => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const updateTagService = new UpdateTagService(inMemoryTagsRepository);

    expect(async () => {
      await updateTagService.execute({id: tag.id, name: tag.name});
    }).rejects.toThrow(BadRequestError);
  });

  it('should return 409 Error if Tag name is already in use', async () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createTagService = new CreateTagService(inMemoryTagsRepository);
    const createdTag = await createTagService.execute({ name: 'mockedTag' });
    await createTagService.execute({ name: 'Another mockedTag' });

    const updateTagService = new UpdateTagService(inMemoryTagsRepository);

    expect(async () => {
      await updateTagService.execute({ id: createdTag.id, name: 'Another mockedTag' });
    }).rejects.toThrow(ConflictError);
  });
});

function delay(milliseconds: number){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}