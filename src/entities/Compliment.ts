import { v4 as uuid } from 'uuid';

class Compliment {
  readonly id: string;
  message: string;
  user_sender: string; // is ID
  user_receiver: string; // is ID
  tag_id: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: Partial<Compliment>) {
    Object.assign(this, props);

    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { Compliment };