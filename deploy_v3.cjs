const { execSync } = require('child_process');

console.log("Replacing sqlite3 with better-sqlite3 in backend...");
const fs = require('fs');
let serverCode = fs.readFileSync('keepcodeai-backend/src/server.js', 'utf8');

serverCode = serverCode.replace("const sqlite3 = require('sqlite3').verbose();", "const Database = require('better-sqlite3');");

serverCode = serverCode.replace("const db = new sqlite3.Database(path.join(dbDir, 'database.sqlite'));", "const db = new Database(path.join(dbDir, 'database.sqlite'));");

serverCode = serverCode.replace(/db\.serialize\(\(\) => \{[\s\S]*?\}\);/, `db.exec(\`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )\`);`);

serverCode = serverCode.replace(/db\.run\('INSERT INTO users[^;]+;/, `
        const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        const result = stmt.run(email, hashedPassword);
        const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, message: 'User registered successfully' });
`);

serverCode = serverCode.replace(/db\.get\('SELECT \* FROM users WHERE email = \?', \[email\], async \(err, user\) => \{[\s\S]*?\}\);/g, `
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
`);

fs.writeFileSync('keepcodeai-backend/src/server.js', serverCode);
console.log("Updated server.js");

console.log("Zipping...");
execSync(`powershell -Command "Compress-Archive -Path 'keepcodeai-backend\\*' -DestinationPath 'keepcode_deploy_3.zip' -Force"`, {stdio: 'inherit'});

console.log("Uploading to VDS...");
execSync(`scp -o StrictHostKeyChecking=no keepcode_deploy_3.zip root@191.44.89.41:/root/`, {stdio: 'inherit'});

console.log("Deploying on VDS...");
execSync(`ssh -o StrictHostKeyChecking=no root@191.44.89.41 "cd /root && unzip -o keepcode_deploy_3.zip -d /var/www/keepcodeai/ && cd /var/www/keepcodeai && npm uninstall sqlite3 && npm install better-sqlite3 && pm2 restart keepcodeai-backend"`, {stdio: 'inherit'});
console.log("Done!");
