require('dotenv').config();

const config = {
  dev: (process.env.NODE_ENV !== 'production'),
  cors: process.env.CORS,
  port: (process.env.PORT || 8081),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  jwtKey: process.env.JWT_KEY,
};

module.exports = {config};
