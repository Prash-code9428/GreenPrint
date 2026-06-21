import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getSupabase } from './config/supabase.js';

// Route imports
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Base health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`GreenPrint server running on port ${PORT}`);
});
