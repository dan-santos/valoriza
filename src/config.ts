// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const config = {
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost',
  database: {
    url: process.env.DATABASE_URL
  },
  jsonwebtoken: {
    key: process.env.JSONWEBTOKEN_KEY,
    ttl: process.env.JSONWEBTOKEN_TTL,
  }
};
