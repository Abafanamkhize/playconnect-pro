const axios = require('axios');

async function test() {
  console.log('Testing PlayConnect Auth Service...');
  
  try {
    const health = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed');
    
    // Test registration
    const userData = {
      email: 'test.simple@playconnect.com',
      password: 'Test123!@#',
      firstName: 'Simple',
      lastName: 'Test',
      role: 'player'
    };
    
    const register = await axios.post('http://localhost:3001/api/auth/register', userData);
    console.log('✅ Registration successful:', register.data.message);
    
    console.log('🎉 Authentication system is working!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

test();
