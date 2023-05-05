import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';

class GetComplimentsService {
  constructor (
    private complimentsRepository: IComplimentRepository
  ){}

  async execute(take?: number): Promise<Compliment[]>{
    const compliments = this.complimentsRepository.get(take);

    return compliments;
  }
}

export { GetComplimentsService };