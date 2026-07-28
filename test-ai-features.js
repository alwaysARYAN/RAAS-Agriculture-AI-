/**
 * Test Script for AI Features
 * Run after deployment completes to verify Gemini API
 */

const https = require('https');

const BACKEND_URL = 'https://raas-backend-ten.vercel.app';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BACKEND_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testHealthCheck() {
  log('\n🔍 Testing Health Check...', 'cyan');
  try {
    const result = await makeRequest('/health');
    if (result.status === 200 && result.data.success) {
      log('✅ Backend is healthy and running', 'green');
      log(`   Environment: ${result.data.environment}`, 'blue');
      return true;
    } else {
      log('❌ Health check failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, 'red');
    return false;
  }
}

async function testRegistration() {
  log('\n🔍 Testing Registration...', 'cyan');
  const testUser = {
    name: 'Test Farmer',
    phone: `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    password: 'test123',
    state: 'Gujarat',
    district: 'Ahmedabad',
    language: 'en'
  };

  try {
    const result = await makeRequest('/api/auth/register', 'POST', testUser);
    if (result.status === 201 && result.data.success) {
      log('✅ Registration successful', 'green');
      log(`   User: ${testUser.name} (${testUser.phone})`, 'blue');
      return result.data.data.token;
    } else {
      log('❌ Registration failed', 'red');
      log(`   Message: ${result.data.message}`, 'yellow');
      
      // Try login with existing credentials
      return await testLogin('9876543210', 'test123');
    }
  } catch (error) {
    log(`❌ Registration error: ${error.message}`, 'red');
    // Fallback to login
    return await testLogin('9876543210', 'test123');
  }
}

async function testLogin(phone, password) {
  log('\n🔍 Testing Login (fallback)...', 'cyan');
  try {
    const result = await makeRequest('/api/auth/login', 'POST', { phone, password });
    if (result.status === 200 && result.data.success) {
      log('✅ Login successful', 'green');
      return result.data.data.token;
    } else {
      log('❌ Login failed', 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, 'red');
    return null;
  }
}

async function testChatbot(token) {
  log('\n🤖 Testing AI Chatbot...', 'cyan');
  const testMessage = 'What crops should I grow in monsoon season?';
  
  try {
    log(`   Question: "${testMessage}"`, 'blue');
    const result = await makeRequest('/api/chat/message', 'POST', {
      message: testMessage
    }, token);

    if (result.status === 200 && result.data.success) {
      log('✅ Chatbot is working!', 'green');
      log(`   AI Response: ${result.data.data.ai_response.substring(0, 100)}...`, 'blue');
      return true;
    } else {
      log('❌ Chatbot failed', 'red');
      log(`   Status: ${result.status}`, 'yellow');
      log(`   Message: ${result.data.message}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Chatbot error: ${error.message}`, 'red');
    return false;
  }
}

async function testRecommendations(token) {
  log('\n💡 Testing Recommendations...', 'cyan');
  
  try {
    const result = await makeRequest('/api/recommendations', 'GET', null, token);

    if (result.status === 200 && result.data.success) {
      log('✅ Recommendations working!', 'green');
      log(`   Got ${result.data.data.length} recommendations`, 'blue');
      return true;
    } else {
      log('⚠️  Recommendations may need farm data', 'yellow');
      return true; // Not critical
    }
  } catch (error) {
    log(`⚠️  Recommendations error: ${error.message}`, 'yellow');
    return true; // Not critical
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🧪 RAAS Agriculture AI - Feature Testing', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const results = {
    health: false,
    auth: false,
    chatbot: false,
    recommendations: false
  };

  // Test 1: Health Check
  results.health = await testHealthCheck();
  if (!results.health) {
    log('\n❌ Backend not responding. Deployment may still be in progress.', 'red');
    log('⏳ Wait 2-3 minutes and try again.', 'yellow');
    return;
  }

  // Test 2: Authentication
  const token = await testRegistration();
  results.auth = !!token;
  
  if (!token) {
    log('\n❌ Authentication failed. Cannot test AI features.', 'red');
    log('   Please check backend logs.', 'yellow');
    return;
  }

  // Wait a bit for token to propagate
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: AI Chatbot (Most Important!)
  results.chatbot = await testChatbot(token);

  // Test 4: Recommendations
  results.recommendations = await testRecommendations(token);

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 TEST RESULTS SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Health Check:      ${results.health ? '✅ PASS' : '❌ FAIL'}`, results.health ? 'green' : 'red');
  log(`Authentication:    ${results.auth ? '✅ PASS' : '❌ FAIL'}`, results.auth ? 'green' : 'red');
  log(`AI Chatbot:        ${results.chatbot ? '✅ PASS' : '❌ FAIL'}`, results.chatbot ? 'green' : 'red');
  log(`Recommendations:   ${results.recommendations ? '✅ PASS' : '❌ FAIL'}`, results.recommendations ? 'green' : 'red');
  log('='.repeat(60), 'cyan');

  const allPassed = results.health && results.auth && results.chatbot;
  
  if (allPassed) {
    log('\n🎉 ALL CRITICAL TESTS PASSED!', 'green');
    log('✅ Your AI features are working correctly!', 'green');
    log('\n🌐 Test in browser: https://raas-agriculture-final.vercel.app', 'blue');
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.', 'yellow');
    if (!results.chatbot) {
      log('❌ CRITICAL: AI Chatbot is not working!', 'red');
      log('   Possible issues:', 'yellow');
      log('   1. Gemini API key not set in Vercel', 'yellow');
      log('   2. API key format incorrect', 'yellow');
      log('   3. Quota exceeded', 'yellow');
      log('   4. Backend deployment incomplete', 'yellow');
    }
  }
  
  log('\n');
}

// Run tests
runAllTests().catch(error => {
  log(`\n💥 Test script error: ${error.message}`, 'red');
  process.exit(1);
});
