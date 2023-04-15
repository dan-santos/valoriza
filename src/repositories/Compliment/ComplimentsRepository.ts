import { Compliment } from '../../entities/Compliment';
import { prismaClient } from '../PrismaClient';
import { IComplimentRepository } from './ComplimentsRepository.interface';

const client = prismaClient;

class ComplimentsRepository implements IComplimentRepository {
  create(compliment: Partial<Compliment>): Compliment {
    return new Compliment({
      ...compliment,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  save(compliment: Compliment): Promise<Compliment> {
    return client.compliment.create({
      data: compliment
    });
  }

  get(take?: number): Promise<Compliment[]> {
    if(take){
      return client.compliment.findMany({take: take});
    }
    return client.compliment.findMany();
  }
  
  findById(id: string): Promise<Compliment> {
    return client.compliment.findFirst({
      where: {
        id: {
          equals: id
        },
      },
    });
  }

  findByReceiver(user_id: string): Promise<Compliment[]> {
    return client.compliment.findMany({
      where: {
        user_receiver: user_id
      },
    });
  }

  findBySender(user_id: string): Promise<Compliment[]> {
    return client.compliment.findMany({
      where: {
        user_sender: user_id
      }
    });
  }
  
  update(compliment: Partial<Compliment>): Promise<Compliment> {
    compliment.updated_at = new Date();

    return client.compliment.update({
      where: {
        id: compliment.id
      },
      data: compliment
    });
  }
}

export { ComplimentsRepository };