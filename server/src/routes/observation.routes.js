// src/routes/observation.routes.js
import { Router } from 'express';
import {
  getObservations,
  getObservation,
  createObservationHandler,
  updateObservationHandler,
  deleteObservationHandler,
  deleteAllObservationsHandler,
  restoreObservationHandler,
  deleteFilteredObservationsHandler,
  exportObservations,
} from '../controllers/observation.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createObservationSchema,
  updateObservationSchema,
  observationIdParamSchema,
  listObservationsQuerySchema,
  exportObservationsQuerySchema,
} from '../validators/observation.schema.js';

export const observationRouter = Router();

observationRouter.use(authenticate);

// IMPORTANT: /export must come before /:id
observationRouter.get(
  '/export',
  authorize('admin', 'operator'),
  validate(exportObservationsQuerySchema, 'query'),
  exportObservations
);

observationRouter.get('/', validate(listObservationsQuerySchema, 'query'), getObservations);
observationRouter.get('/:id', validate(observationIdParamSchema, 'params'), getObservation);

observationRouter.post(
  '/',
  authorize('admin', 'operator'),
  validate(createObservationSchema),
  createObservationHandler
);

observationRouter.patch(
  '/:id',
  authorize('admin', 'operator'),
  validate(observationIdParamSchema, 'params'),
  validate(updateObservationSchema),
  updateObservationHandler
);

observationRouter.delete(
  '/filter',
  authorize('admin'),
  deleteFilteredObservationsHandler
);

observationRouter.post(
  '/:id/restore',
  authorize('admin'),
  validate(observationIdParamSchema, 'params'),
  restoreObservationHandler
);

observationRouter.delete(
  '/all',
  authorize('admin'),
  deleteAllObservationsHandler
);

observationRouter.delete(
  '/:id',
  authorize('admin'),
  validate(observationIdParamSchema, 'params'),
  deleteObservationHandler
);


