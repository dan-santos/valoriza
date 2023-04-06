import { v4 as uuid } from 'uuid';

class Tag {
  readonly id: string;
  name: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: Partial<Tag>) {
    Object.assign(this, props);

    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { Tag };