import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';

class InMemoryComplimentsRepository implements IComplimentRepository {

  public compliments: Compliment[] = [];

  create(compliment: Partial<Compliment>): Compliment {
    return new Compliment({
      ...compliment,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  save(compliment: Compliment): Promise<Compliment> {
    this.compliments.push(compliment);
    return Promise.resolve(compliment);
  }

  get(take?: number): Promise<Compliment[]> {
    let list: Compliment[] = [];
    if(take){
      list = this.compliments.slice(0, take);
    } else {
      list = this.compliments;
    }
    return Promise.resolve(list);
  }
  
  findById(id: string): Promise<Compliment> {
    const compliment = this.compliments.find((elem) => elem.id === id);
    return Promise.resolve(compliment);
  }

  findByReceiver(user_id: string): Promise<Compliment[]> {
    const compliments = this.compliments.filter((elem) => elem.user_receiver === user_id);
    return Promise.resolve(compliments);
  }

  findBySender(user_id: string): Promise<Compliment[]> {
    const compliments = this.compliments.filter((elem) => elem.user_receiver === user_id);
    return Promise.resolve(compliments);
  }
  
  update(compliment: Partial<Compliment>): Promise<Compliment> {
    compliment.updated_at = new Date();

    const complimentIndex = this.compliments.findIndex((elem) => elem.id === compliment.id);
    const foundCompliment = this.compliments[complimentIndex];
    foundCompliment.message = compliment.message;
    foundCompliment.tag_id = compliment.tag_id;
    foundCompliment.user_receiver = compliment.user_receiver;
    foundCompliment.updated_at = compliment.updated_at;

    return Promise.resolve(foundCompliment);
  }

  delete(id: string): Promise<Compliment> {
    const complimentIndex = this.compliments.findIndex((elem) => elem.id === id);
    const deletedCompliment = this.compliments[complimentIndex];
    this.compliments.splice(complimentIndex, 1);
    return Promise.resolve(deletedCompliment);
  }
}

export { InMemoryComplimentsRepository };