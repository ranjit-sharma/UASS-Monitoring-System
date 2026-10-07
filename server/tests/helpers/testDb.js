// tests/helpers/testDb.js
import mongoose from 'mongoose';
import '../../src/config/env.js';

const TEST_URI = process.env.MONGODB_URI_TEST;

export async function connectTestDb() {
  // If already connected (e.g. another test file), reuse the connection
  if (mongoose.connection.readyState === 1) return;
  if (!TEST_URI) {
    throw new Error('MONGODB_URI_TEST is required to run backend tests.');
  }
  await mongoose.connect(TEST_URI, { sanitizeFilter: true });
}

export async function disconnectTestDb() {
  // Clear all collections in the test DB, then disconnect.
  // Do NOT drop the database — dropping breaks parallel/sequential multi-file test runs
  // because Jest runs all test files against the same Mongoose instance.
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
  await mongoose.disconnect();
}

export async function clearCollection(modelName) {
  const model = mongoose.model(modelName);
  await model.deleteMany({});
}
