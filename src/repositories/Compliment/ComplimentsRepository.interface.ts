import { Compliment } from '../../entities/Compliment';

export interface IComplimentRepository {
  findById(id: string): Promise<Compliment>;
  find(take?: number): Promise<Compliment[]>;
  create(compliment: Partial<Compliment>): Compliment;
  save(compliment: Compliment): Promise<Compliment>;
}