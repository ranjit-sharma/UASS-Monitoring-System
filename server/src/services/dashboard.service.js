// src/modules/dashboard/dashboard.service.js
import { Observation } from '../models/observation.model.js';
import { DataCollection } from '../models/dataCollection.model.js';

/**
 * Returns aggregate statistics for the dashboard summary card.
 */
export async function getDashboardSummary() {
  const [totalObservations, activeSession, latestObservation] = await Promise.all([
    Observation.countDocuments(),
    DataCollection.findOne({ status: 'running' }).sort({ startedAt: -1 }).lean(),
    Observation.findOne().sort({ recordedAt: -1 }).select('recordedAt source').lean(),
  ]);

  return {
    totalObservations,
    activeSession: activeSession
      ? { id: activeSession._id, sessionName: activeSession.sessionName, startedAt: activeSession.startedAt, source: activeSession.source }
      : null,
    lastObservationAt: latestObservation?.recordedAt ?? null,
    lastObservationSource: latestObservation?.source ?? null,
  };
}

/**
 * Returns the N most recent observations for charting.
 * Defaults to 50 points.
 */
export async function getLatestObservations(limit = 50) {
  return Observation.find()
    .sort({ recordedAt: -1 })
    .limit(Math.min(limit, 200))
    .lean();
}

