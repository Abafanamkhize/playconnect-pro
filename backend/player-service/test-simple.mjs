import dotenv from 'dotenv';
dotenv.config();

import { testConnection, sequelize } from './src/config/database.js';

async function simpleTest() {
  console.log('🧪 Simple Database Connection Test...\n');

  // Test database connection
  console.log('1. Testing database connection...');
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    return;
  }
  console.log('✅ Database connection successful\n');

  // Test if we can query existing tables
  console.log('2. Testing basic query capability...');
  try {
    const [result] = await sequelize.query('SELECT current_database() as db_name, current_user as db_user');
    console.log('✅ Basic query successful');
    console.log('   Database:', result[0].db_name);
    console.log('   User:', result[0].db_user);

    // Try to list existing tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `);
    console.log('   Existing tables:', tables.map(t => t.table_name).join(', ') || 'None');
    
  } catch (error) {
    console.log('❌ Query test failed:', error.message);
  }
  
  console.log('\n🎉 Basic database setup is working!');
  console.log('💡 Next: We can start implementing the API endpoints!');
}

simpleTest().catch(console.error);
