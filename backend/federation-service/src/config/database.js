import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.DB_DIALECT === 'sqlite') {
    // Use SQLite for development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE,
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
} else {
    // Use PostgreSQL for production
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false
        }
    );
}

// Test database connection
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Federation Service Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        return false;
    }
};

export { sequelize };
