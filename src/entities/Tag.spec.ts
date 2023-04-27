import {describe, it, expect} from 'vitest';
import { Tag } from './Tag';

describe('When tag is created', () => {
  it('should keep the id value when it is passed as a parameter', () => {
    const mockedId = '0';
    const tag = new Tag({
      id: mockedId,
      created_at: new Date(),
      updated_at: new Date(),
      name: 'name'
    });

    expect(tag.id).toStrictEqual(mockedId);
  });

  it('should create random id value when it is not passed as a parameter', () => {
    const tag = new Tag({
      created_at: new Date(),
      updated_at: new Date(),
      name: 'name'
    });

    expect(tag.id).toBeTruthy();
  });
});