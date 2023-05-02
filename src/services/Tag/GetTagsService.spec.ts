import { describe, it, expect } from 'vitest';
import { GetTagsService } from './GetTagsService';
import { InMemoryTagsRepository } from '../../tests/repositories/InMemoryTagsRepository';
import { CreateTagService } from './CreateTagService';

describe('When GetTagsService is called', () => {
  it('should return empty list object if no tags created', async () => {
    const getTagService = new GetTagsService(new InMemoryTagsRepository());

    const tags = await getTagService.execute();
    expect(tags).toStrictEqual([]);
  });

  it.each([1, 2, 3])('should return list of N tags if take param assumes N value', async (take) => {
    const inMemoryTagsRepository = new InMemoryTagsRepository();
    const createTagService = new CreateTagService(inMemoryTagsRepository);

    await createTagService.execute({ name: 'mockedTag' });
    await createTagService.execute({ name: 'mockedTag2' });
    await createTagService.execute({ name: 'mockedTag3' });

    const getTagService = new GetTagsService(inMemoryTagsRepository);

    const tags = await getTagService.execute(take);
    expect(tags.length).toStrictEqual(take);
  });
});