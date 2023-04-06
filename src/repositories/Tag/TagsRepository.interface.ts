import { Tag } from '../../entities/Tag';

export interface ITagRepository {
  findByName(name: string): Promise<Tag>;
  find(take?: number): Promise<Tag[]>;
  create(tag: Partial<Tag>): Tag;
  save(tag: Tag): Promise<Tag>;
}