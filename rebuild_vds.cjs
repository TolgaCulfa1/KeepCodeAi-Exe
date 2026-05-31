const { execSync } = require('child_process');
console.log("Fixing dependencies on VDS...");
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /var/www/keepcodeai && rm -rf node_modules && npm install && pm2 restart keepcodeai-backend"`, {stdio: 'inherit'});
