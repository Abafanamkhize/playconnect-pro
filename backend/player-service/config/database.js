const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for test environment to avoid connection issues
const getDatabaseConfig = () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    };
  }

  return {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  };
};

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' 
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/playconnect',
  getDatabaseConfig()
);

// Only test connection in non-test environments
if (process.env.NODE_ENV !== 'test') {
  sequelize.authenticate()
    .then(() => console.log('Database connection established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
} else {
  console.log('Test database configured (SQLite in-memory)');
}

module.exports = sequelize;
