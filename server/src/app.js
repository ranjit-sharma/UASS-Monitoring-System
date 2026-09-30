// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route modules will be imported here as they are built
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { observationRouter } from './routes/observation.routes.js';
import { collectionRouter } from './routes/collection.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { auditLogRouter } from './routes/auditLog.routes.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS â€” only allow the configured client origin
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true, // allow cookies
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    })
  );

  // Body parsers with size limit to prevent large payload attacks
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // Cookie parser for HTTP-only JWT cookies
  app.use(cookieParser());

  // Health check â€” unauthenticated, not logged
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // API routes
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/observations', observationRouter);
  app.use('/api/v1/collections', collectionRouter);
  app.use('/api/v1/dashboard', dashboardRouter);
  app.use('/api/v1/audit-logs', auditLogRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(globalErrorHandler);

  return app;
}

