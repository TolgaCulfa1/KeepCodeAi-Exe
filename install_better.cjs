const { execSync } = require('child_process');
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /var/www/keepcodeai && npm uninstall sqlite3 && npm install better-sqlite3 && pm2 restart keepcodeai-backend"`, {stdio: 'inherit'});
