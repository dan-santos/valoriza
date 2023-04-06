import { User } from '../../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  find(take?: number): Promise<User[]>;
  create(user: Partial<User>): User;
  save(user: User): Promise<User>;
}