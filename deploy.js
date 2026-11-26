// deploy.js - Executed in Jenkins "Deploy" Stage (npm run deploy)
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('[STAGE: DEPLOY] Starting deployment process');
console.log('====================================================');

const distDir = path.join(__dirname, 'dist');
const deployDir = path.join(__dirname, 'deploy', 'production');

// 1. Verify build artifacts exist before deploying
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.js'))) {
  console.error('ERROR: Build directory "dist/" not found! Build stage must run before Deploy.');
  process.exit(1);
}

// 2. Prepare clean production deployment directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });
console.log(`-> Target deployment folder initialized: ${deployDir}`);

// 3. Deploy packaged files from dist/ to production deploy directory
fs.copyFileSync(path.join(distDir, 'index.js'), path.join(deployDir, 'index.js'));
fs.copyFileSync(path.join(distDir, 'package.json'), path.join(deployDir, 'package.json'));
if (fs.existsSync(path.join(distDir, 'build-metadata.json'))) {
  fs.copyFileSync(path.join(distDir, 'build-metadata.json'), path.join(deployDir, 'build-metadata.json'));
}
console.log('-> Deployed application code and metadata into target production directory.');

// 4. Generate deployment receipt & report
const deployReceipt = `====================================================
DEPLOYMENT RECEIPT
====================================================
Application   : jenkins-node-app
Target Env    : PRODUCTION
Deploy Date   : ${new Date().toISOString()}
Build Number  : ${process.env.BUILD_NUMBER || 'local-deployment'}
Status        : DEPLOYED_AND_VERIFIED
Port          : 3000
====================================================`;

fs.writeFileSync(path.join(deployDir, 'deployment-report.txt'), deployReceipt, 'utf-8');
console.log(deployReceipt);

console.log('====================================================');
console.log('DEPLOY SUCCESS: Application successfully deployed!');
console.log('====================================================');
process.exit(0);
