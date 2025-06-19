// Debug script to test notification API
const axios = require('axios');

const API_URL = 'http://192.168.0.104:3000/api/notifications';

async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    console.log('API URL:', API_URL);
    
    // Test basic connectivity
    const response = await axios.get(API_URL, {
      timeout: 5000
    });
    
    console.log('Success! Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('API Test Failed:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    }
  }
}

testAPI();
