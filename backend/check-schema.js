const db = require('./models');

async function checkSchema() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check Players table structure
    const playersColumns = await db.sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Players'
      ORDER BY ordinal_position
    `);
    
    console.log('\\n📊 Players table columns:');
    playersColumns[0].forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable} - Default: ${col.column_default}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
