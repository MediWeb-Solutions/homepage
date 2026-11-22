import { loadEnv } from 'vite';
import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL } = loadEnv('development', process.cwd(), '');
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in the environment or .env file.');
}

export default defineConfig({
  schema: './src/lib/server/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL }
});
