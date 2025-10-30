import fs from 'fs/promises';
import path from 'path';
import db from '../config/db.js';

const migrationsDir = path.join(process.cwd(), 'db', 'migrations');

async function run() {
  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    console.log('Migrations to run:', sqlFiles);

    for (const file of sqlFiles) {
      const p = path.join(migrationsDir, file);
      const sql = await fs.readFile(p, 'utf8');
      console.log('Applying', file);
      await db.query(sql);
    }

    console.log('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
