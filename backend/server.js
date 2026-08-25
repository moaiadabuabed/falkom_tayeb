const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializePool } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes Definition
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/publicRoutes'));

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Falkom API Server running with Oracle DB' });
});

// Handling Unknown Routes (404 JSON response instead of HTML)
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
initializePool().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database pool:', err);
});