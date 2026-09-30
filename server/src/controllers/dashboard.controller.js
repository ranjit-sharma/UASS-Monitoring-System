// src/modules/dashboard/dashboard.controller.js
import { getDashboardSummary, getLatestObservations } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getSummary = asyncHandler(async (_req, res) => {
  const summary = await getDashboardSummary();
  sendSuccess(res, 200, 'Dashboard summary retrieved', summary);
});

export const getLatest = asyncHandler(async (req, res) => {
  // Safely parse the limit query param; default 50, max 200
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const observations = await getLatestObservations(limit);
  sendSuccess(res, 200, 'Latest observations retrieved', observations);
});

