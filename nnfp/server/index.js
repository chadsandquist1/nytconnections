import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nnfpRoutes from './api/nnfp.js';
import predictRoutes from './api/predict.js';
import spreadRoutes from './api/spread.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/nnfp', nnfpRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/spread', spreadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`NNFP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
