const { execSync } = require('child_process');

console.log("Connecting to VDS via SSH...");
const sshCommand = `ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /root && rm -rf /var/www/keepcodeai/* && unzip -o keepcode_deploy.zip -d /var/www/keepcodeai/ && cd /var/www/keepcodeai && npm install && (pm2 restart keepcodeai-backend || pm2 start src/server.js --name keepcodeai-backend)"`;

try {
  execSync(sshCommand, { stdio: 'inherit' });
  console.log("Deployment on VDS complete!");
} catch (error) {
  console.error("Deploy failed:", error);
}
