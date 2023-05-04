import { IComplimentRepository } from '../../repositories/Compliment/ComplimentsRepository.interface';
import { ITagRepository } from '../../repositories/Tag/TagsRepository.interface';
import { IUserRepository } from '../../repositories/User/UsersRepository.interface';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/CustomErrors';

interface IComplimentRequestDTO {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  constructor(
    private complimentsRespository: IComplimentRepository,
    private usersRepository: IUserRepository,
    private tagsRepository: ITagRepository
  ){}

  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequestDTO) {
    if (!tag_id || !user_sender || !user_receiver || !message) {
      throw new BadRequestError('tag, user, receiver or message cannot be empty/null');
    }

    if (user_sender === user_receiver) throw new ForbiddenError('You cannot send compliment to yourself');
    
    const receiver = await this.usersRepository.findById(user_receiver);
    if (!receiver) throw new NotFoundError('User receiver doesnt exists');
    const sender = await this.usersRepository.findById(user_sender);
    if (!sender) throw new NotFoundError('User sender doesnt exists');
    const tag = await this.tagsRepository.findById(tag_id);
    if (!tag) throw new NotFoundError('Tag doesnt exists');

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