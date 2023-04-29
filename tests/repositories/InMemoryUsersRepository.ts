import { User } from '../../src/entities/User';
import { IUserRepository } from '../../src/repositories/User/UsersRepository.interface';

class InMemoryUsersRepository implements IUserRepository {

  public users: User[] = [];

  create(user: Partial<User>): User {
    return new User({
      ...user,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  save(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  get(take?: number): Promise<User[]> {
    let list: User[] = [];
    if(take){
      list = this.users.slice(0, take);
    } else {
      list = this.users;
    }
    return Promise.resolve(list);
  }
  
  findByEmail(email: string): Promise<User>{
    const user = this.users.find((elem) => elem.email === email);
    return Promise.resolve(user);
  }

  findById(id: string): Promise<User> {
    const user = this.users.find((elem) => elem.id === id);
    return Promise.resolve(user);
  }

  update(user: Partial<User>): Promise<User> {
    user.updated_at = new Date();

    const userIndex = this.users.findIndex((elem) => elem.id === user.id);
    this.users[userIndex] = user as User;

    return Promise.resolve(user as User);
  }
  delete(id: string): Promise<User> {
    const userIndex = this.users.findIndex((elem) => elem.id === id);
    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return Promise.resolve(deletedUser);
  }
}

export { InMemoryUsersRepository };