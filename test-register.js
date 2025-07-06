const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  try {
    console.log('Testing user registration...');
    
    // Test registration
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
      role: 'passenger'
    });
    
    console.log('Registration successful:', registerResponse.data);
    
    // Test login
    console.log('\nTesting user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAuth(); 