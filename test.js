// Unit test suite for Jenkins CI/CD pipeline
const assert = require('assert');
const server = require('./index');

console.log('Running automated unit tests for Jenkins pipeline...');

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

// Test 1: Verify health check route (/health)
const reqHealth = { url: '/health', method: 'GET' };
const resHealth = createMockRes(({ statusCode, body }) => {
  assert.strictEqual(statusCode, 200, 'Health endpoint must return status 200');
  const json = JSON.parse(body);
  assert.strictEqual(json.status, 'UP', 'Health status should be UP');
  console.log('✔ Test 1 Passed: /health endpoint returned 200 OK with status UP');
});
server.emit('request', reqHealth, resHealth);

// Test 2: Verify root route (/)
const reqRoot = { url: '/', method: 'GET' };
const resRoot = createMockRes(({ statusCode, body }) => {
  assert.strictEqual(statusCode, 200, 'Root endpoint must return status 200');
  assert.ok(body.includes('Jenkins Node.js App'), 'Root endpoint should return app page');
  console.log('✔ Test 2 Passed: / root endpoint returned 200 OK with valid HTML');
});
server.emit('request', reqRoot, resRoot);

// Test 3: Verify about route (/about)
const reqAbout = { url: '/about', method: 'GET' };
const resAbout = createMockRes(({ statusCode, body }) => {
  assert.strictEqual(statusCode, 200, 'About endpoint must return status 200');
  assert.ok(body.includes('Jenkins CI/CD'), 'About endpoint should mention Jenkins CI/CD');
  console.log('✔ Test 3 Passed: /about endpoint returned 200 OK');

  console.log('\n=======================================');
  console.log('All Jenkins CI/CD tests PASSED successfully!');
  console.log('=======================================');
  process.exit(0);
});
server.emit('request', reqAbout, resAbout);
