// src/routes/dashboard.routes.js
import { Router } from 'express';
import { getSummary, getLatest } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.get('/summary', getSummary);
dashboardRouter.get('/latest', getLatest);

