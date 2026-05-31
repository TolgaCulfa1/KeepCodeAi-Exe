const { execSync } = require('child_process');
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "pm2 stop keepcodeai && pm2 delete keepcodeai && pm2 save"`, {stdio: 'inherit'});
