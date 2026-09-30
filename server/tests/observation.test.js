// tests/observation.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { connectTestDb, disconnectTestDb } from './helpers/testDb.js';
import { User } from '../src/models/user.model.js';
import { Observation } from '../src/models/observation.model.js';
import { createApp } from '../src/app.js';

let app;
let adminCookies;
let viewerCookies;
let adminUser;

const sampleObservation = {
  altitude: 1000,
  temperature: 8.5,
  pressure: 898.7,
  humidity: 65.2,
  windSpeed: 12.3,
  windDirection: 270,
  recordedAt: new Date().toISOString(),
  source: 'manual',
};

beforeAll(async () => {
  await connectTestDb();
  app = createApp();

  // Create admin
  const hash = await bcrypt.hash('adminpass1', 10);
  adminUser = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    passwordHash: hash,
    role: 'admin',
    isActive: true,
  });

  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.com', password: 'adminpass1' });
  adminCookies = adminLogin.headers['set-cookie'];

  // Create viewer
  const viewerHash = await bcrypt.hash('viewerpass1', 10);
  await User.create({
    name: 'Viewer',
    email: 'viewer@test.com',
    passwordHash: viewerHash,
    role: 'viewer',
    isActive: true,
  });

  const viewerLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'viewer@test.com', password: 'viewerpass1' });
  viewerCookies = viewerLogin.headers['set-cookie'];
});

afterAll(async () => {
  await disconnectTestDb();
});

beforeEach(async () => {
  await Observation.deleteMany({});
});

describe('GET /api/v1/observations', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/observations');
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty array when no observations', async () => {
    const res = await request(app)
      .get('/api/v1/observations')
      .set('Cookie', adminCookies);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });
});

describe('POST /api/v1/observations', () => {
  it('creates an observation as admin', async () => {
    const res = await request(app)
      .post('/api/v1/observations')
      .set('Cookie', adminCookies)
      .send(sampleObservation);

    expect(res.status).toBe(201);
    expect(res.body.data.altitude).toBe(1000);
    expect(res.body.data.source).toBe('manual');
  });

  it('returns 403 when viewer tries to create', async () => {
    const res = await request(app)
      .post('/api/v1/observations')
      .set('Cookie', viewerCookies)
      .send(sampleObservation);

    expect(res.status).toBe(403);
  });

  it('returns 400 on missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/observations')
      .set('Cookie', adminCookies)
      .send({ altitude: 1000 }); // missing most fields

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it('returns 400 on out-of-range altitude', async () => {
    const res = await request(app)
      .post('/api/v1/observations')
      .set('Cookie', adminCookies)
      .send({ ...sampleObservation, altitude: 60000 }); // > 50000

    expect(res.status).toBe(400);
  });

  it('does not expose internal fields in response', async () => {
    const res = await request(app)
      .post('/api/v1/observations')
      .set('Cookie', adminCookies)
      .send(sampleObservation);

    expect(res.body.data.__v).toBeUndefined();
  });
});

describe('DELETE /api/v1/observations/:id', () => {
  it('deletes as admin', async () => {
    const obs = await Observation.create({ ...sampleObservation, createdBy: adminUser._id });

    const res = await request(app)
      .delete(`/api/v1/observations/${obs._id}`)
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('returns 403 when viewer tries to delete', async () => {
    const obs = await Observation.create({ ...sampleObservation, createdBy: adminUser._id });

    const res = await request(app)
      .delete(`/api/v1/observations/${obs._id}`)
      .set('Cookie', viewerCookies);

    expect(res.status).toBe(403);
  });

  it('returns 400 on invalid ID format', async () => {
    const res = await request(app)
      .delete('/api/v1/observations/not-an-objectid')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(400);
  });

  it('returns 404 on non-existent observation', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .delete(`/api/v1/observations/${fakeId}`)
      .set('Cookie', adminCookies);

    expect(res.status).toBe(404);
  });
});

