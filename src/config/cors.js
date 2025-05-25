/**
 * CORS configuration for different environments
 */
const corsOptions = {
  development: {
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  production: {
    origin: process.env.CORS_ORIGIN || 'https://hamutea-frontend.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

module.exports = corsOptions[process.env.NODE_ENV || 'development'];