import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import programRoutes from './routes/program.routes';
import peopleRoutes from './routes/people.routes';
import registrationRoutes from './routes/registration.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ── CORS — contract Section 22 ───────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'http://localhost:5173',
  'http://localhost:3000', // extra dev convenience
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'Community Program & Volunteer Impact Tracking API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

// ── Routes — base URL: /api/v1 (contract Section 9) ─────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1', peopleRoutes);               // /participants, /volunteers
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// ── Global error handler — MUST be last ──────────────────────────────────────
app.use(errorHandler);

export default app;
