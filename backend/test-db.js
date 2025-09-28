const db = require('./models');

async function testDB() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    await db.sequelize.sync();
    console.log('✅ All models synchronized!');
    
    console.log('🎉 Database layer completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDB();
