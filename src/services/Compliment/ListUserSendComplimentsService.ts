import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';

class ListUserSendComplimentsService {
  constructor(
    private complimentsRespository: IComplimentRepository,
  ){}
  
  async execute(user_id: string): Promise<Compliment[]>{
    const compliments = await this.complimentsRespository.findBySender(user_id);

    return compliments;
  }
}

export { ListUserSendComplimentsService };