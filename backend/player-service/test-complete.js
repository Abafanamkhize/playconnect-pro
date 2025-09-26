require('dotenv').config();
const { testConnection } = require('./src/config/database');

async function testAll() {
  console.log('🧪 Testing PlayConnect Database Setup...\n');
  
  // Test database connection
  console.log('1. Testing database connection...');
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    return;
  }
  console.log('✅ Database connection successful\n');
  
  // Test model loading
  console.log('2. Testing model loading...');
  try {
    const Player = require('./src/models/Player');
    const Federation = require('./src/models/Federation');
    const Match = require('./src/models/Match');
    console.log('✅ All models loaded successfully\n');
    
    // Test model synchronization
    console.log('3. Testing model synchronization...');
    await Player.sync({ force: false });
    await Federation.sync({ force: false }); 
    await Match.sync({ force: false });
    console.log('✅ All models synchronized with database\n');
    
    console.log('🎉 All tests passed! Your database setup is ready.');
    
  } catch (error) {
    console.log('❌ Model test failed:', error.message);
  }
}

testAll().catch(console.error);
