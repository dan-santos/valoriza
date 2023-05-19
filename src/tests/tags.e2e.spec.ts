import { describe, it, expect } from 'vitest';
import { app } from '../server';

describe('[E2E] Testing all tags related endpoints', () => {
  const baseURL = '/tags';

  it('CREATE', () => {
    const response = app.post(baseURL);
    expect(response).toBeNull();
  });
});