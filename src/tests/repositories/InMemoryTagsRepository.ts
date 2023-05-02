import { Tag } from '../../entities/Tag';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';

class InMemoryTagsRepository implements ITagRepository {

  public tags: Tag[] = [];

  create(tag: Partial<Tag>): Tag {
    return new Tag({
      ...tag,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  save(tag: Tag): Promise<Tag> {
    this.tags.push(tag);
    return Promise.resolve(tag);
  }

  get(take?: number): Promise<Tag[]> {
    let list: Tag[] = [];
    if(take){
      list = this.tags.slice(0, take);
    } else {
      list = this.tags;
    }
    return Promise.resolve(list);
  }
  
  findByName(name: string): Promise<Tag>{
    const tag = this.tags.find((elem) => elem.name === name);
    return Promise.resolve(tag);
  }
  findById(id: string): Promise<Tag> {
    const tag = this.tags.find((elem) => elem.id === id);
    return Promise.resolve(tag);
  }

  update(tag: Partial<Tag>): Promise<Tag> {
    tag.updated_at = new Date();

    const tagIndex = this.tags.findIndex((elem) => elem.id === tag.id);
    const foundTag = this.tags[tagIndex];
    foundTag.name = tag.name;
    foundTag.updated_at = tag.updated_at;

    return Promise.resolve(foundTag);
  }

  delete(id: string): Promise<Tag> {
    const tagIndex = this.tags.findIndex((elem) => elem.id === id);
    const deletedTag = this.tags[tagIndex];
    this.tags.splice(tagIndex, 1);
    return Promise.resolve(deletedTag);
  }
}

export { InMemoryTagsRepository };