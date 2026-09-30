// src/scripts/seedAdmin.js
/**
 * Seed script to create the initial admin account.
 * Run once during initial setup: npm run seed
 * This script is NOT an API endpoint and must never be exposed over HTTP.
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import readline from 'readline';

async function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { sanitizeFilter: true });
  console.log('Connected to MongoDB.');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = await prompt(rl, 'Admin name: ');
  const email = (await prompt(rl, 'Admin email: ')).toLowerCase().trim();
  const password = await prompt(rl, 'Admin password (min 8 chars): ');
  rl.close();

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.error(`A user with email "${email}" already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name, email, passwordHash, role: 'admin', isActive: true });

  console.log(`\nAdmin account created for ${email}. You can now log in.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

