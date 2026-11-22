import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import * as schema from './schema';
import { db } from './db';

const secret = env.BETTER_AUTH_SECRET;
const baseURL = env.BETTER_AUTH_URL ?? 'http://localhost:3000';

if (!secret && !building) {
  throw new Error('BETTER_AUTH_SECRET must be set before the application starts.');
}
if (secret && secret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long.');
}
if (!env.BETTER_AUTH_URL && !building && env.NODE_ENV === 'production') {
  throw new Error('BETTER_AUTH_URL must be set in production.');
}

export const auth = betterAuth({
  appName: 'MediWeb Solutions',
  baseURL,
  secret: secret ?? 'build-only-secret-not-for-runtime-use-32-characters',
  trustedOrigins: [baseURL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 200
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14
  }
});
