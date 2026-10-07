// src/config/env.js
import 'dotenv/config';
import dns from 'node:dns';

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'COOKIE_NAME',
  'CLIENT_URL',
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Check .env.example.`
    );
  }
  // Warn about weak JWT secret in production
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }
}

validateEnv();

const mongoDnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (mongoDnsServers.length > 0) {
  dns.setServers(mongoDnsServers);
}

export const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  mongoUriTest: process.env.MONGODB_URI_TEST,
  mongoDnsServers,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  cookieName: process.env.COOKIE_NAME,
  clientUrl: process.env.CLIENT_URL,
  simulatorIntervalMs: parseInt(process.env.SIMULATOR_INTERVAL_MS, 10) || 1000,
  hardwareApiKey: process.env.HARDWARE_API_KEY || 'default-secret-api-key',
};
