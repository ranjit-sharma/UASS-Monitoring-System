// tests/helpers/jestSetup.js
// Set NODE_ENV before dotenv/config loads in subsequent setupFiles.
// This ensures test-environment-conditional logic (e.g. rate limiting skip)
// behaves correctly during automated test runs.
process.env.NODE_ENV = 'test';
