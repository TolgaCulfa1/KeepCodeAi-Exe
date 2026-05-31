const { execSync } = require('child_process');
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "pm2 logs keepcodeai-backend --lines 20"`, {stdio: 'inherit'});
