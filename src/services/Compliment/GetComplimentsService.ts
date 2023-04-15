import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';

interface IRequestComplimentDTO {
  take?: number;
}

class GetComplimentsService {
  constructor (
    private complimentsRepository: IComplimentRepository
  ){}

  async execute({ take }: IRequestComplimentDTO): Promise<Compliment[]>{
    const compliments = this.complimentsRepository.get(take);

    return compliments;
  }
}

export { GetComplimentsService };