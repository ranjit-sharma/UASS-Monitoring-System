// src/modules/observations/observation.controller.js
import {
  listObservations,
  getObservationById,
  createObservation,
  updateObservation,
  deleteObservation,
  exportObservationsCsv,
  exportObservationsExcel,
} from '../services/observation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, buildPagination } from '../utils/response.js';

export const getObservations = asyncHandler(async (req, res) => {
  const { page, limit, startDate, endDate, minAltitude, maxAltitude, source, sortBy, sortOrder } = req.query;
  const { observations, total } = await listObservations({
    page, limit, startDate, endDate, minAltitude, maxAltitude, source, sortBy, sortOrder,
  });
  sendSuccess(res, 200, 'Observations retrieved', observations, {
    pagination: buildPagination(page, limit, total),
  });
});

export const getObservation = asyncHandler(async (req, res) => {
  const observation = await getObservationById(req.params.id);
  sendSuccess(res, 200, 'Observation retrieved', observation);
});

export const createObservationHandler = asyncHandler(async (req, res) => {
  const observation = await createObservation(req.body, req.user._id);
  sendSuccess(res, 201, 'Observation created', observation);
});

export const updateObservationHandler = asyncHandler(async (req, res) => {
  const observation = await updateObservation(req.params.id, req.body, req.user._id);
  sendSuccess(res, 200, 'Observation updated', observation);
});

export const deleteObservationHandler = asyncHandler(async (req, res) => {
  await deleteObservation(req.params.id, req.user._id);
  sendSuccess(res, 200, 'Observation deleted');
});

export const deleteAllObservationsHandler = asyncHandler(async (req, res) => {
  await import('../services/observation.service.js').then(s => s.deleteAllObservations(req.user._id));
  sendSuccess(res, 200, 'All observations deleted');
});

export const restoreObservationHandler = asyncHandler(async (req, res) => {
  await import('../services/observation.service.js').then(s => s.restoreObservation(req.params.id, req.user._id));
  sendSuccess(res, 200, 'Observation restored');
});

export const deleteFilteredObservationsHandler = asyncHandler(async (req, res) => {
  const count = await import('../services/observation.service.js').then(s => s.deleteObservationsByFilter(req.query, req.user._id));
  sendSuccess(res, 200, `${count} observations deleted`);
});

// CSV or Excel export streams directly to response
export const exportObservations = asyncHandler(async (req, res) => {
  if (req.query.format === 'excel' || req.query.format === 'xlsx') {
    await exportObservationsExcel(req.query, res);
  } else {
    await exportObservationsCsv(req.query, res);
  }
});


