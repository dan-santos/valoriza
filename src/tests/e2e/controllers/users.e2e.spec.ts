import { describe, it, expect } from 'vitest';
import { session } from '../../../server';
import request from 'supertest';
import { getAdminTokenAndId } from '../../../utils/GetValidBearerToken';
import { UsersRepository } from '../../../repositories/User/UsersRepository';
import { User } from '../../../entities/User';

describe('[E2E] Testing all users related endpoints', async () => {

  const baseURL = '/users';
  const successStatusCode = 200;
  const { token, id } = await getAdminTokenAndId(new UsersRepository);
  const payload: Partial<User> = { name: 'CreatedUser', email: 'user.e2e@mail.com', password: '123' };
  let createdUser: User;

  it('CREATE', async () => {
    const response = await request(session)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdUser = response.body as User;
    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('GET', async () => {
    const response = await request(session)
      .get(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('PUT', async () => {
    createdUser.name = 'UpdatedUser';

    const response = await request(session)
      .put(`${baseURL}/${createdUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(createdUser);

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('DELETE', async () => {
    const response = await request(session)
      .delete(`${baseURL}/${createdUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set({user_id: id})
      .send();

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });
});