const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

// Import models properly
const Player = require('./models/player');
const Federation = require('./models/federation'); 
const User = require('./models/user');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Initialize models
    Player(sequelize, DataTypes);
    Federation(sequelize, DataTypes);
    User(sequelize, DataTypes);
    
    // Test associations
    await sequelize.sync({ force: false });
    console.log('✅ All models synchronized successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
