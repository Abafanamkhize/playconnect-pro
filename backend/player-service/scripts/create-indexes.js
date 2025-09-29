const { Sequelize } = require('sequelize');

// Direct database connection for scripts
const sequelize = new Sequelize(
  'postgresql://postgres:password@localhost:5432/playconnect',
  {
    dialect: 'postgres',
    logging: console.log,
  }
);

const createIndexes = async () => {
  try {
    console.log('Creating database indexes for optimization...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Player table indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_players_position ON "Players" ("position");
      CREATE INDEX IF NOT EXISTS idx_players_nationality ON "Players" ("nationality");
      CREATE INDEX IF NOT EXISTS idx_players_verification ON "Players" ("verificationStatus");
      CREATE INDEX IF NOT EXISTS idx_players_federation ON "Players" ("federationId");
      CREATE INDEX IF NOT EXISTS idx_players_created_at ON "Players" ("createdAt" DESC);
    `);
    
    // Federation table indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_federations_country ON "Federations" ("country");
      CREATE INDEX IF NOT EXISTS idx_federations_sport ON "Federations" ("sport");
      CREATE INDEX IF NOT EXISTS idx_federations_verification ON "Federations" ("verificationLevel");
    `);
    
    console.log('Database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
