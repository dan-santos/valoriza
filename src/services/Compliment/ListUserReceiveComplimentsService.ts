import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';

class ListUserReceiveComplimentsService {
  constructor(
    private complimentsRespository: IComplimentRepository,
  ){}
  
  async execute(user_id: string): Promise<Compliment[]>{
    const compliments = await this.complimentsRespository.findByReceiver(user_id);

    return compliments;
  }
}

export { ListUserReceiveComplimentsService };