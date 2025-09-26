import sequelize from './src/config/database.js';

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test creating the table
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

testDB();
