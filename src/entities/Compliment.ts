import { v4 as uuid } from 'uuid';

class Compliment {
  readonly id: string;
  message: string;
  senderId: string;
  receiverId: boolean;
  tagId: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: Partial<Compliment>) {
    Object.assign(this, props);

    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { Compliment }