import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3333,
  test_port: process.env.TEST_PORT || 3001,
  host: process.env.HOST || 'localhost',
  database: {
    url: process.env.DATABASE_URL
  },
  jsonwebtoken: {
    key: process.env.JSONWEBTOKEN_KEY,
    ttl: process.env.JSONWEBTOKEN_TTL,
  }
};
