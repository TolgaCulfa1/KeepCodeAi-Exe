const { execSync } = require('child_process');
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cat /var/www/keepcodeai/src/server.js"`, {stdio: 'inherit'});
