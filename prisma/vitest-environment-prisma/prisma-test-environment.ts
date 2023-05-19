import { PrismaClient } from '@prisma/client';
import type { Environment } from 'vitest';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {

  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  // custom setup
  setup() {
    const testSchemaName = `test${randomUUID()}`;
    const testDatabaseUrl = generateDatabaseURL(testSchemaName);

    process.env.DATABASE_URL = testDatabaseUrl;

    // executing migrations
    // we are using 'npx prisma migrate deploy' instead of 'npx prisma migrate dev' 
    // because we don't want to check for any changes in our schema.prisma file
    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${testSchemaName}" CASCADE`,
        );
        await prisma.$disconnect();
      }
    };
  }
};
