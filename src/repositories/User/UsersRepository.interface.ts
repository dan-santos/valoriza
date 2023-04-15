import { User } from '../../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  get(take?: number): Promise<User[]>;
  create(user: Partial<User>): User;
  save(user: User): Promise<User>;
  update(user: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
}