import { describe, it, expect } from 'vitest';
import { CreateTagService } from './CreateTagService';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { BadRequestError } from '../../utils/CustomErrors';

describe('When create tag service is called', () => {
  it('should be return Tag object if name are correctly filled', async () => {
    const tagService = new CreateTagService(new InMemoryTagsRepository());

    const tagName = { name: 'mockedTag' };

    const createdTag = await tagService.execute(tagName);

    expect(createdTag.name).toStrictEqual('mockedTag');
  });

  it('should be return Error if name already exists in database', async () => {
    const tagService = new CreateTagService(new InMemoryTagsRepository());

    const tagName = { name: 'mockedTag' };

    await tagService.execute(tagName);

    expect(async () => {await tagService.execute(tagName);}).rejects.toThrow(BadRequestError);
  });

  it.each([
    { name: null },
    { name: '' }
  ])('should be return Error if name are null or empty', (name) => {
    const tagService = new CreateTagService(new InMemoryTagsRepository());

    const tagName = name;

    expect(async () => {await tagService.execute(tagName);}).rejects.toThrow(BadRequestError);
  });
});