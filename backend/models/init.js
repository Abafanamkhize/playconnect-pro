const sequelize = require('../config/database');
const Player = require('./Player');
const Federation = require('./Federation');
const User = require('./User');

// Define associations
Federation.hasMany(Player, {
  foreignKey: 'federationId',
  as: 'players'
});

Player.belongsTo(Federation, {
  foreignKey: 'federationId',
  as: 'federation'
});

Federation.hasMany(User, {
  foreignKey: 'federationId',
  as: 'users'
});

User.belongsTo(Federation, {
  foreignKey: 'federationId',
  as: 'federation'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Database synced successfully');
    
    // Create test federation if none exists
    const federationCount = await Federation.count();
    if (federationCount === 0) {
      await Federation.create({
        name: 'Test Sports Federation',
        country: 'South Africa',
        contactEmail: 'admin@testfederation.co.za',
        verificationLevel: 'verified'
      });
      console.log('✅ Test federation created');
    }
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
};

module.exports = {
  sequelize,
  Player,
  Federation,
  User,
  syncDatabase
};
