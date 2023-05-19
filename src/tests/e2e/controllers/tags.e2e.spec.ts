import { describe, it, expect } from 'vitest';
import { app } from '../../../server';
import request from 'supertest';
import { getAdminToken } from '../../../utils/GetValidBearerToken';
import { UsersRepository } from '../../../repositories/User/UsersRepository';

describe('[E2E] Testing all tags related endpoints', async () => {

  const baseURL = '/tags';
  const bearerToken = await getAdminToken(new UsersRepository);

  it('CREATE', async () => {
    const response = await request(app)
      .post(baseURL)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send();

    expect(response.statusCode).toStrictEqual(200);
  });
});