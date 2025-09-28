const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test models
    const Player = require('./models/player')(sequelize, Sequelize.DataTypes);
    const Federation = require('./models/federation')(sequelize, Sequelize.DataTypes);
    const User = require('./models/user')(sequelize, Sequelize.DataTypes);
    
    console.log('✅ All models loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
