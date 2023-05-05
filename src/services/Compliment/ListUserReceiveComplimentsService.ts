import { Compliment } from '../../entities/Compliment';
import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';

class ListUserReceiveComplimentsService {
  constructor(
    private complimentsRespository: IComplimentRepository,
  ){}
  
  async execute(user_id: string): Promise<Compliment[]>{
    if (!user_id) throw new BadRequestError('user_id cannot be empty/null');
    const compliments = await this.complimentsRespository.findByReceiver(user_id);

    return compliments;
  }
}

export { ListUserReceiveComplimentsService };