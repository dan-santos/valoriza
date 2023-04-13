import { v4 as uuid } from 'uuid';

class User {
  readonly id: string;
  name: string;
  email: string;
  admin: boolean;
  password: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: Partial<User>) {
    Object.assign(this, props);

    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { User };