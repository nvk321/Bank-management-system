import fs from 'fs/promises';
import path from 'path';
import db from '../config/db.js';

const seedsDir = path.join(process.cwd(), 'db', 'seeds');

async function run() {
  try {
    const files = await fs.readdir(seedsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    console.log('Seeds to run:', sqlFiles);

    for (const file of sqlFiles) {
      const p = path.join(seedsDir, file);
      const sql = await fs.readFile(p, 'utf8');
      console.log('Executing', file);
      await db.query(sql);
    }

    console.log('Seeds applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
