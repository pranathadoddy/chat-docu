import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is not set in the environment variables.');
}

const sql = neon(process.env.NEON_DATABASE_URL!);

export const db = drizzle(sql);
