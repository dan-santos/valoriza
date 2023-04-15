import { Compliment } from '../../entities/Compliment';

export interface IComplimentRepository {
  findById(id: string): Promise<Compliment>;
  findByReceiver(user_id: string): Promise<Compliment[]>;
  findBySender(user_id: string): Promise<Compliment[]>;
  get(take?: number): Promise<Compliment[]>;
  create(compliment: Partial<Compliment>): Compliment;
  save(compliment: Compliment): Promise<Compliment>;
  update(compliment: Partial<Compliment>): Promise<Compliment>;
}