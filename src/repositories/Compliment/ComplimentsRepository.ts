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

  find(take?: number): Promise<Compliment[]> {
    if(take){
      return client.compliment.findMany({take: take});
    }
    return client.compliment.findMany();
  }
  
  findById(id: string): Promise<Compliment>{
    return client.compliment.findFirst({
      where: {
        id: {
          equals: id
        },
      },
    });
  }
}

export { ComplimentsRepository };