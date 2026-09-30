// src/modules/data-collection/collection.service.js
import { DataCollection, isValidTransition } from '../models/dataCollection.model.js';
import { Observation } from '../models/observation.model.js';
import { SimulatorDataSource } from '../collectors/simulator.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { createAuditLog } from './auditLog.service.js';
import { AUDIT_ACTIONS } from '../models/auditLog.model.js';

// Module-level map of active data sources keyed by session ID string.
// Only one session should be running at a time, but the map supports
// future multi-session scenarios.
const activeSources = new Map();

// Socket.IO broadcast function â€” injected via init() to avoid circular imports.
let _broadcast = null;

/**
 * Injects the Socket.IO broadcast function.
 * Called once from socket.server.js after Socket.IO is initialized.
 */
export function initBroadcast(broadcastFn) {
  _broadcast = broadcastFn;
}

function broadcast(event, payload) {
  if (_broadcast) _broadcast(event, payload);
}

export async function listCollections({ page, limit, status }) {
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;
  const [sessions, total] = await Promise.all([
    DataCollection.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    DataCollection.countDocuments(filter),
  ]);
  return { sessions, total };
}

export async function getCollectionById(id) {
  const session = await DataCollection.findById(id).lean();
  if (!session) throw ApiError.notFound('Collection session not found');
  return session;
}

/**
 * Starts a new simulated data collection session.
 * Prevents starting if a session is already running.
 */
export async function startCollection({ sessionName }, userId) {
  const running = await DataCollection.findOne({ status: 'running' });
  if (running) {
    throw ApiError.conflict(
      `A collection session is already running: "${running.sessionName}". Stop it before starting a new one.`
    );
  }

  const session = await DataCollection.create({
    sessionName: sessionName || `Session ${new Date().toISOString()}`,
    status: 'running',
    startedAt: new Date(),
    source: 'simulator',
    createdBy: userId,
  });

  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.COLLECTION_STARTED,
    resource: 'collections',
    resourceId: session._id.toString(),
  });

  const dataSource = new SimulatorDataSource();
  activeSources.set(session._id.toString(), dataSource);

  dataSource.start(
    session._id.toString(),
    (observationPayload) =>
      _handleObservation(observationPayload, session._id, userId),
    (err) => _handleSourceError(err, session._id, userId)
  );

  const sessionJson = session.toJSON();
  broadcast('collection:started', sessionJson);

  logger.info({ sessionId: session._id }, 'Collection session started');
  return sessionJson;
}

/**
 * Stops a running collection session.
 */
export async function stopCollection(sessionId, userId) {
  const session = await DataCollection.findById(sessionId);
  if (!session) throw ApiError.notFound('Collection session not found');

  if (!isValidTransition(session.status, 'completed')) {
    throw ApiError.badRequest(
      `Cannot stop a session with status "${session.status}"`
    );
  }

  const dataSource = activeSources.get(sessionId);
  if (dataSource) {
    dataSource.stop();
    activeSources.delete(sessionId);
  }

  session.status = 'completed';
  session.endedAt = new Date();
  await session.save();

  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.COLLECTION_STOPPED,
    resource: 'collections',
    resourceId: sessionId,
  });

  const sessionJson = session.toJSON();
  broadcast('collection:stopped', sessionJson);

  logger.info({ sessionId }, 'Collection session stopped');
  return sessionJson;
}

/**
 * Handles a validated observation payload from the data source.
 * Saves to DB and broadcasts via Socket.IO.
 */
async function _handleObservation(payload, sessionId, userId) {
  try {
    const observation = await Observation.create({
      ...payload,
      sessionId,
      createdBy: userId,
    });

    const observationJson = observation.toJSON();
    broadcast('observation:new', observationJson);
  } catch (err) {
    // Log but do not stop the session â€” invalid observations are discarded
    logger.error({ err, sessionId }, 'Failed to save simulated observation');
  }
}

/**
 * Handles a non-fatal error from the data source.
 * If errors are persistent, marks session as failed.
 */
async function _handleSourceError(err, sessionId, userId) {
  logger.error({ err, sessionId }, 'Data source error');
  try {
    const session = await DataCollection.findById(sessionId);
    if (session && session.status === 'running') {
      session.status = 'failed';
      session.endedAt = new Date();
      await session.save();

      const dataSource = activeSources.get(sessionId.toString());
      if (dataSource) {
        dataSource.stop();
        activeSources.delete(sessionId.toString());
      }

      broadcast('collection:stopped', {
        ...session.toJSON(),
        reason: 'error',
      });

      await createAuditLog({
        userId,
        action: AUDIT_ACTIONS.COLLECTION_STOPPED,
        resource: 'collections',
        resourceId: sessionId.toString(),
        metadata: { reason: 'error', error: err.message },
      });
    }
  } catch (innerErr) {
    logger.error({ err: innerErr }, 'Failed to handle data source error');
  }
}

/**
 * Ingests live telemetry data directly from external sensors / hardware streams.
 * Saves to DB and broadcasts in real-time via Socket.IO.
 */
export async function ingestHardwareTelemetry(payload, userId) {
  let activeSession = await DataCollection.findOne({ status: 'running' });
  if (!activeSession) {
    activeSession = await DataCollection.create({
      sessionName: `Live Hardware Stream ${new Date().toLocaleTimeString()}`,
      status: 'running',
      startedAt: new Date(),
      source: 'instrument',
      createdBy: userId || null,
    });
    broadcast('collection:started', activeSession.toJSON());
  }

  const observation = await Observation.create({
    altitude: payload.altitude,
    temperature: payload.temperature,
    pressure: payload.pressure,
    humidity: payload.humidity,
    windSpeed: payload.windSpeed,
    windDirection: payload.windDirection,
    source: payload.source || 'instrument',
    recordedAt: payload.recordedAt ? new Date(payload.recordedAt) : new Date(),
    sessionId: activeSession._id,
    createdBy: userId || activeSession.createdBy,
  });

  const observationJson = observation.toJSON();
  broadcast('observation:new', observationJson);

  return observationJson;
}

/**
 * Returns the current status of all active sessions.
 * Used for periodic status broadcasts.
 */
export function getActiveSessions() {
  return [...activeSources.keys()];
}


