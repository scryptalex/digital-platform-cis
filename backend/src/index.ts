import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), port: PORT });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Continue without database for now
  }
  
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
  });
};

startServer();
