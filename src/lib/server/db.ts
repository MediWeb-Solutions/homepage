import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  env.DATABASE_URL ?? (building ? 'postgres://build:build@localhost:5432/build' : undefined);

if (!connectionString) {
  throw new Error('DATABASE_URL must be set before the application starts.');
}

const client = postgres(connectionString, {
  max: env.NODE_ENV === 'production' ? 10 : 1,
  connect_timeout: 10
});

export const db = drizzle(client, { schema });
