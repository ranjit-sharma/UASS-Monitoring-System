// src/modules/data-collection/collection.controller.js
import {
  listCollections,
  getCollectionById,
  startCollection,
  stopCollection,
  ingestHardwareTelemetry,
} from '../services/collection.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, buildPagination } from '../utils/response.js';

export const getCollections = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const { sessions, total } = await listCollections({ page, limit, status });
  sendSuccess(res, 200, 'Collection sessions retrieved', sessions, {
    pagination: buildPagination(page, limit, total),
  });
});

export const getCollection = asyncHandler(async (req, res) => {
  const session = await getCollectionById(req.params.id);
  sendSuccess(res, 200, 'Collection session retrieved', session);
});

export const startCollectionHandler = asyncHandler(async (req, res) => {
  const session = await startCollection(req.body, req.user._id);
  sendSuccess(res, 201, 'Data collection started', session);
});

export const stopCollectionHandler = asyncHandler(async (req, res) => {
  const session = await stopCollection(req.params.id, req.user._id);
  sendSuccess(res, 200, 'Data collection stopped', session);
});

export const ingestTelemetryHandler = asyncHandler(async (req, res) => {
  const observation = await ingestHardwareTelemetry(req.body, req.user?._id);
  sendSuccess(res, 201, 'Live sensor telemetry ingested', observation);
});


