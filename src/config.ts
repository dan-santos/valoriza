// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const config = {
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost',
  database: {
    type: process.env.DATABASE_TYPE || 'sqlite',
    url: process.env.DATABASE_URL || 'file:./database/db.local.sqlite',
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
  },
  jsonwebtoken: {
    key: process.env.JSONWEBTOKEN_KEY,
    ttl: process.env.JSONWEBTOKEN_TTL,
  }
};