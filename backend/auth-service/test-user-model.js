const User = require('./models/User');
const sequelize = require('./config/database');

async function testUserModel() {
  try {
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection OK');
    
    console.log('2. Testing User model...');
    console.log('User model type:', typeof User);
    console.log('User.findOne type:', typeof User.findOne);
    
    console.log('3. Testing User.findOne...');
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('✅ User.findOne works:', user ? 'User found' : 'No user found');
    
    console.log('4. Testing User.create...');
    const newUser = await User.create({
      email: 'test2@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: 'player'
    });
    console.log('✅ User.create works:', newUser.email);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testUserModel();
