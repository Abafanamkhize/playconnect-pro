const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'playconnect',
  username: 'postgres',
  password: 'password',
  host: 'localhost',  // This should work since port 5432 is mapped
  port: 5432,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { sequelize };
