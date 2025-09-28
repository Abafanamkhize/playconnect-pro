const http = require('http');

const TEST_EMAIL = 'test@federation.com';
const TEST_PASSWORD = 'testpass123';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Authentication Tests...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET'
    });
    console.log('✅ Health:', health.data.status);
    
    // Test 2: Registration
    console.log('\n2. Testing registration...');
    const register = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: 'federation_admin',
      federationId: '550e8400-e29b-41d4-a716-446655440000'
    });
    
    console.log('Registration response:', register.status, register.data);
    
    if (register.status === 201) {
      console.log('✅ Registration successful');
      const token = register.data.token;
      
      // Test 3: Protected Route
      console.log('\n3. Testing protected route...');
      const protected = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/protected',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Protected route response:', protected.status, protected.data);
      
      if (protected.status === 200) {
        console.log('✅ Protected route access granted');
      } else {
        console.log('❌ Protected route failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
    
    console.log('\n🎉 Tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Check if server is running first
makeRequest({
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
}).then(() => {
  console.log('✅ Server is running, starting tests...');
  runTests();
}).catch(() => {
  console.log('❌ Server is not running on port 3001');
  console.log('Please start the server first with: node server.js');
});
