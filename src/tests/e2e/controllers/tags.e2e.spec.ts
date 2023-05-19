import { describe, it, expect } from 'vitest';
import { app } from '../../../server';
import request from 'supertest';
import { getAdminTokenAndId } from '../../../utils/GetValidBearerToken';
import { UsersRepository } from '../../../repositories/User/UsersRepository';
import { Tag } from '../../../entities/Tag';

describe('[E2E] Testing all tags related endpoints', async () => {

  const baseURL = '/tags';
  const { token } = await getAdminTokenAndId(new UsersRepository);
  const payload: Partial<Tag> = { name: 'AnyTagName' };

  it('CREATE', async () => {
    const response = await request(app)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.statusCode).toStrictEqual(200);
  });
});