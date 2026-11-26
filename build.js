// build.js - Executed in Jenkins "Build" Stage (npm run build)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('[STAGE: BUILD] Starting build and packaging process');
console.log('====================================================');

// 1. Verify core files exist and syntax is valid
console.log('-> Validating JavaScript syntax for index.js...');
execSync('node -c index.js', { stdio: 'inherit' });

// 2. Prepare clean distribution directory (dist/)
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('-> Created clean distribution directory: dist/');

// 3. Copy production runtime files to dist/
fs.copyFileSync(path.join(__dirname, 'index.js'), path.join(distDir, 'index.js'));
fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(distDir, 'package.json'));
console.log('-> Copied index.js and package.json to dist/');

// 4. Generate build metadata artifact
const buildMetadata = {
  appName: 'jenkins-node-app',
  buildNumber: process.env.BUILD_NUMBER || 'local-dev',
  buildTimestamp: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  status: 'COMPILED_AND_PACKAGED'
};

fs.writeFileSync(
  path.join(distDir, 'build-metadata.json'),
  JSON.stringify(buildMetadata, null, 2),
  'utf-8'
);

console.log('-> Generated dist/build-metadata.json:');
console.log(JSON.stringify(buildMetadata, null, 2));

console.log('====================================================');
console.log('BUILD SUCCESS: Artifacts created and ready for tests!');
console.log('====================================================');
process.exit(0);
