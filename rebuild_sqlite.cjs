const { execSync } = require('child_process');
console.log("Rebuilding sqlite3 from source on VDS to match GLIBC version...");
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /var/www/keepcodeai && npm rebuild sqlite3 --build-from-source && pm2 restart keepcodeai-backend"`, {stdio: 'inherit'});
