import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'playconnect',
  process.env.DB_USER || 'playconnect_user',
  process.env.DB_PASSWORD || 'playconnect123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Player Service Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export { sequelize, testConnection };
