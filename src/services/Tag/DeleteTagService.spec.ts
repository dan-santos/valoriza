import { describe, it, expect } from 'vitest';
import { DeleteTagService } from './DeleteTagService';
import { CreateTagService } from './CreateTagService';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { BadRequestError, NotFoundError } from '../../utils/CustomErrors';

describe('When delete tag service is called', () => {
  it('should return Tag object if tag is successfully deleted', async () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createTagService = new CreateTagService(inMemoryTagsRepository);
    const createdTag = await createTagService.execute({ name: 'mockedTag' });

    const deleteTagService = new DeleteTagService(inMemoryTagsRepository);
    const deletedTag = await deleteTagService.execute(createdTag.id);

    expect(createdTag).toStrictEqual(deletedTag);
  });

  it.each([
    { id: null },
    { id: '' }
  ])('should return 400 Error if tag id is empty or null', (tag) => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const mockedId = tag.id;
    const deleteTagService = new DeleteTagService(inMemoryTagsRepository);
  
    expect(async () => {await deleteTagService.execute(mockedId);}).rejects.toThrow(BadRequestError);
  });

  it('should return 404 Error if tag is not found', async () => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const idOfInexistentTag = '0';
    const deleteTagService = new DeleteTagService(inMemoryTagsRepository);

    expect(async () => {await deleteTagService.execute(idOfInexistentTag);}).rejects.toThrow(NotFoundError);
  });
});