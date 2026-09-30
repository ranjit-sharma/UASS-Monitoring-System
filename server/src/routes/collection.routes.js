// src/routes/collection.routes.js
import { Router } from 'express';
import {
  getCollections,
  getCollection,
  startCollectionHandler,
  stopCollectionHandler,
  ingestTelemetryHandler,
} from '../controllers/collection.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  startCollectionSchema,
  collectionIdParamSchema,
  listCollectionsQuerySchema,
} from '../validators/collection.schema.js';

export const collectionRouter = Router();

collectionRouter.use(authenticate);

collectionRouter.get(
  '/',
  validate(listCollectionsQuerySchema, 'query'),
  getCollections
);

collectionRouter.get(
  '/:id',
  validate(collectionIdParamSchema, 'params'),
  getCollection
);

// /start must be registered before /:id/stop to avoid Express matching
// "start" as a dynamic :id segment on a different route.
collectionRouter.post(
  '/start',
  authorize('admin', 'operator'),
  validate(startCollectionSchema),
  startCollectionHandler
);

collectionRouter.post(
  '/telemetry',
  ingestTelemetryHandler
);

collectionRouter.post(
  '/:id/stop',
  authorize('admin', 'operator'),
  collectionIdParamSchema ? validate(collectionIdParamSchema, 'params') : (req, res, next) => next(),
  stopCollectionHandler
);


