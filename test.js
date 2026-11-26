// test.js - Executed in Jenkins "Test" Stage (npm test)
const assert = require('assert');
const { server, math, VERSION } = require('./index');

console.log('====================================================');
console.log('[STAGE: TEST] Executing automated test suite');
console.log('====================================================');

let testsPassed = 0;

// Test 1: Math Utility Logic (Unit Tests)
console.log('-> Running Unit Tests on business math module...');
assert.strictEqual(math.add(10, 5), 15, '10 + 5 must equal 15');
assert.strictEqual(math.multiply(4, 5), 20, '4 * 5 must equal 20');
console.log('  ✔ Unit Test: math.add() and math.multiply() verified.');
testsPassed += 2;

// Mock Response Helper
function createMockRes(callback) {
  let statusCode = 200;
  let headers = {};
  let body = '';

  return {
    writeHead(code, h) {
      statusCode = code;
      if (h) headers = Object.assign(headers, h);
    },
    setHeader(name, value) {
      headers[name] = value;
    },
    end(data) {
      if (data) body += data;
      callback({ statusCode, headers, body });
    }
  };
}

// Test 2: Health Check Endpoint Integration Test
console.log('-> Testing GET /health endpoint...');
server.emit('request', { url: '/health', method: 'GET' }, createMockRes(({ statusCode, body }) => {
  assert.strictEqual(statusCode, 200, 'Health endpoint must return status code 200');
  const json = JSON.parse(body);
  assert.strictEqual(json.status, 'UP', 'Health status must be UP');
  console.log('  ✔ Integration Test: /health returned status 200 and status="UP".');
  testsPassed++;

  // Test 3: API Info Endpoint
  console.log('-> Testing GET /api/info endpoint...');
  server.emit('request', { url: '/api/info', method: 'GET' }, createMockRes(({ statusCode: codeInfo, body: bodyInfo }) => {
    assert.strictEqual(codeInfo, 200, 'Info endpoint must return 200');
    const jsonInfo = JSON.parse(bodyInfo);
    assert.strictEqual(jsonInfo.version, VERSION, `Version must match ${VERSION}`);
    console.log(`  ✔ Integration Test: /api/info returned version ${jsonInfo.version}.`);
    testsPassed++;

    // Test 4: Calculation API Endpoint
    console.log('-> Testing GET /api/calculate?a=20&b=30 endpoint...');
    server.emit('request', { url: '/api/calculate?a=20&b=30', method: 'GET' }, createMockRes(({ statusCode: codeCalc, body: bodyCalc }) => {
      assert.strictEqual(codeCalc, 200, 'Calculate endpoint must return 200');
      const jsonCalc = JSON.parse(bodyCalc);
      assert.strictEqual(jsonCalc.result, 50, '20 + 30 must equal 50');
      console.log('  ✔ Integration Test: /api/calculate returned correct result 50.');
      testsPassed++;

      // Final report
      console.log('====================================================');
      console.log(`TEST SUCCESS: All ${testsPassed} tests PASSED with 0 errors!`);
      console.log('====================================================');
      process.exit(0);
    }));
  }));
}));
