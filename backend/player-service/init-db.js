import sequelize from './src/config/database.js';

async function initialize() {
  try {
    console.log('🔄 Initializing database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initialize();
