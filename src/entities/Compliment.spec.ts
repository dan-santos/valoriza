import {describe, it, expect} from 'vitest';
import { Compliment } from './Compliment';

describe('When compliment is created', () => {
  it('should keep the id value when it is passed as a parameter', () => {
    const mockedId = '0';
    const compliment = new Compliment({
      id: mockedId,
      user_sender: 'senderid',
      user_receiver: 'receiverid',
      tag_id: 'tagid',
      created_at: new Date(),
      updated_at: new Date(),
      message: 'message'
    });

    expect(compliment.id).toStrictEqual(mockedId);
  });

  it('should create random id value when it is not passed as a parameter', () => {
    const compliment = new Compliment({
      user_sender: 'senderid',
      user_receiver: 'receiverid',
      tag_id: 'tagid',
      created_at: new Date(),
      updated_at: new Date(),
      message: 'message'
    });

    expect(compliment.id).toBeTruthy();
  });
});