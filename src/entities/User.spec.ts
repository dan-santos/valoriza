import {describe, it, expect} from 'vitest';
import { User } from './User';

describe('When user is created', () => {
  it('should keep the id value when it is passed as a parameter', () => {
    const mockedId = '0';
    const user = new User({
      id: mockedId,
      admin: false,
      email: 'mock@mail.com',
      password: 'verysecurepassword',
      created_at: new Date(),
      updated_at: new Date(),
      name: 'user'
    });

    expect(user.id).toStrictEqual(mockedId);
  });

  it('should create random id value when it is not passed as a parameter', () => {
    const user = new User({
      admin: false,
      email: 'mock@mail.com',
      password: 'verysecurepassword',
      created_at: new Date(),
      updated_at: new Date(),
      name: 'user'
    });

    expect(user.id).toBeTruthy();
  });
});