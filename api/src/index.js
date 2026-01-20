require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { pool } = require('./config/database');

const PORT = config.port;

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });
