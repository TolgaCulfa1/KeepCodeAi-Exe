const { execSync } = require('child_process');

console.log("Fixing missing catch block in server.js on VDS...");
const fs = require('fs');

let serverCode = fs.readFileSync('keepcodeai-backend/src/server.js', 'utf8');

serverCode = serverCode.replace(/app\.post\('\/api\/login', \(\) => \{[\s\S]*?\}\);/g, `
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);
        
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
`);

fs.writeFileSync('keepcodeai-backend/src/server.js', serverCode);

console.log("Re-uploading and restarting...");
execSync(`powershell -Command "Compress-Archive -Path 'keepcodeai-backend\\*' -DestinationPath 'keepcode_deploy_4.zip' -Force"`, {stdio: 'inherit'});
execSync(`scp -o StrictHostKeyChecking=no keepcode_deploy_4.zip root@191.44.89.41:/root/`, {stdio: 'inherit'});
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /root && unzip -o keepcode_deploy_4.zip -d /var/www/keepcodeai/ && cd /var/www/keepcodeai && pm2 restart keepcodeai-backend"`, {stdio: 'inherit'});
console.log("Done!");
