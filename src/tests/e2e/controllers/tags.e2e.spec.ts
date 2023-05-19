import { describe, it, expect } from 'vitest';
import { app } from '../../../server';
import request from 'supertest';
import { getAdminTokenAndId } from '../../../utils/GetValidBearerToken';
import { UsersRepository } from '../../../repositories/User/UsersRepository';
import { Tag } from '../../../entities/Tag';

describe('[E2E] Testing all tags related endpoints', async () => {

  const baseURL = '/tags';
  const successStatusCode = 200;
  const { token } = await getAdminTokenAndId(new UsersRepository);
  const payload: Partial<Tag> = { name: 'CreatedTag' };
  let createdTag: Tag;

  it('CREATE', async () => {
    const response = await request(app)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdTag = response.body as Tag;
    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('GET', async () => {
    const response = await request(app)
      .get(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('PUT', async () => {
    createdTag.name = 'UpdatedTag';

    const response = await request(app)
      .put(`${baseURL}/${createdTag.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(createdTag);

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });

  it('DELETE', async () => {
    const response = await request(app)
      .delete(`${baseURL}/${createdTag.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toStrictEqual(successStatusCode);
  });
});