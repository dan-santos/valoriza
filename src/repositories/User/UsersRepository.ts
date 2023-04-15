import { User } from '../../entities/User';
import { prismaClient } from '../PrismaClient';
import { IUserRepository } from './UsersRepository.interface';

const client = prismaClient;

class UsersRepository implements IUserRepository {
  create(user: Partial<User>): User {
    return new User({
      ...user,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  save(user: User): Promise<User> {
    return client.user.create({
      data: user
    });
  }

  get(take?: number): Promise<User[]> {
    if(take){
      return client.user.findMany({take: take});
    }
    return client.user.findMany();
  }
  
  findByEmail(email: string): Promise<User>{
    return client.user.findFirst({
      where: {
        email: {
          equals: email
        },
      },
    });
  }

  findById(id: string): Promise<User> {
    return client.user.findFirst({
      where: {
        id: {
          equals: id
        },
      },
    });
  }

  update(user: Partial<User>): Promise<User> {
    user.updated_at = new Date();

    return client.user.update({
      where: {
        id: user.id
      },
      data: user
    });
  }
}

export { UsersRepository };