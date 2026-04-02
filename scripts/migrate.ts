import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL mangler.');
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const migration = readFileSync(join(process.cwd(), 'drizzle', '0000_init.sql'), 'utf8');
  await sql(migration);
  console.log('Migrasjon kjørt: drizzle/0000_init.sql');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
