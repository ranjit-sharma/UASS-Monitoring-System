// tests/auth.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { connectTestDb, disconnectTestDb } from './helpers/testDb.js';
import { User } from '../src/models/user.model.js';
import { createApp } from '../src/app.js';

let app;

beforeAll(async () => {
  await connectTestDb();
  app = createApp();
});

afterAll(async () => {
  await disconnectTestDb();
});

beforeEach(async () => {
  await User.deleteMany({});
});

async function createTestUser(overrides = {}) {
  const defaults = {
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
    role: 'viewer',
    isActive: true,
  };
  return User.create({ ...defaults, ...overrides });
}

describe('POST /api/v1/auth/login', () => {
  it('returns 200 and sets cookie on valid credentials', async () => {
    await createTestUser();

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('test@example.com');
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 on wrong password', async () => {
    await createTestUser();

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 on non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 for inactive account', async () => {
    await createTestUser({ isActive: false });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 on missing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it('returns 400 on invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('does not expose passwordHash in response', async () => {
    await createTestUser();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns 401 without a cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 200 with valid cookie', async () => {
    await createTestUser();

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe('test@example.com');
    expect(JSON.stringify(meRes.body)).not.toContain('passwordHash');
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('returns 401 without cookie', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(401);
  });

  it('clears cookie on logout', async () => {
    await createTestUser();

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookies);

    expect(logoutRes.status).toBe(200);
    // The set-cookie header should clear the auth cookie (max-age=0)
    const setCookie = logoutRes.headers['set-cookie']?.join(';') || '';
    expect(setCookie).toContain('Expires=Thu, 01 Jan 1970');
  });
});

describe('Authorization middleware', () => {
  it('returns 403 when viewer tries to access admin-only endpoint', async () => {
    await createTestUser({ role: 'viewer' });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/v1/users')
      .set('Cookie', cookies);

    expect(res.status).toBe(403);
  });

  it('returns 200 when admin accesses admin-only endpoint', async () => {
    await createTestUser({ role: 'admin' });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/v1/users')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
  });
});

