import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError } from '../../utils/CustomErrors';

interface IComplimentRequestDTO {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  constructor(
    private complimentsRespository: IComplimentRepository,
    private usersRepository: IUserRepository
  ){}

  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequestDTO) {
    if (user_sender === user_receiver) throw new BadRequestError('You cannot send compliment to yourself');
    
    // if user is able to trigger this request, then, sender is already verified and authenticated
    const receiver = this.usersRepository.findById(user_receiver);
    if (!receiver) throw new BadRequestError('User receiver doesnt exists');

    const compliment = this.complimentsRespository.create({
      tag_id,
      user_receiver,
      user_sender,
      message
    });

    await this.complimentsRespository.save(compliment);

    return compliment;
  }
}

export { CreateComplimentService };