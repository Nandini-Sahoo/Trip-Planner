import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';

connectDB();

const app = express();

// Allow both localhost AND your production frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://trip-planner-delta-opal.vercel.app/'
];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(express.json());

// Add a test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));