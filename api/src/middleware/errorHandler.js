const { formatError } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection failed';
  }

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json(formatError(message));
};

module.exports = errorHandler;
