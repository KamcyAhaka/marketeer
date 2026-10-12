const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('./db/connect');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');

let swaggerDocument;
try {
  swaggerDocument = require('./swagger-output.json');
} catch (e) {
  swaggerDocument = { swagger: '2.0', info: { title: 'Marketeer API', version: '1.0.0' } };
}

const app = express();
const port = process.env.PORT || 3000;

// Enable reverse proxy support for deployments (e.g. Render)
app.enable('trust proxy');

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Z-Key',
      'Authorization',
    ],
  })
);

// Swagger Documentation route
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  const isLocal = host && host.includes('localhost');
  const dynamicDoc = {
    ...swaggerDocument,
    host: host || swaggerDocument.host,
    schemes: isLocal ? ['http', 'https'] : ['https', 'http'],
  };
  return swaggerUi.setup(dynamicDoc)(req, res, next);
});

// Application routes
app.use('/', routes);

// 404 Fallback for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global internal error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred', details: err.message });
});

// Initialize database and start listening
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database connection:', err);
  } else {
    app.listen(port, () => {
      console.log(`Marketeer server running and listening on port ${port}`);
      console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  }
});
