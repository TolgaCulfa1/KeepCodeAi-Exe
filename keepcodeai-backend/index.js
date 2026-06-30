const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'keepcode-super-secret-key-123456';

// Middleware
app.use(cors());
app.use(express.json());

// Serves the static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'keepcode.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            username TEXT,
            password TEXT,
            plan TEXT DEFAULT 'free',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table initialized.');
        }
    });
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token bulunamadı. Lütfen giriş yapın.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token.' });
        }
        req.user = decoded;
        next();
    });
};

// --- AUTH API ROTALARI ---

// 1. Kayıt Ol (Register)
app.post('/api/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`,
            [email, username, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda.' });
                    }
                    return res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.' });
                }

                const userId = this.lastID;
                const token = jwt.sign({ id: userId, email, username }, JWT_SECRET, { expiresIn: '30d' });

                res.status(201).json({
                    token,
                    user: { id: userId, email, username, plan: 'free' }
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
});

// 2. Giriş Yap (Login)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Giriş hatası oluştu.' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });
        }

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ error: 'Hatalı şifre.' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                token,
                user: { id: user.id, email: user.email, username: user.username, plan: user.plan }
            });
        } catch (err) {
            res.status(500).json({ error: 'Sunucu hatası oluştu.' });
        }
    });
});

// 3. Kullanıcı Bilgisi (Me)
app.get('/api/auth/me', authenticateToken, (req, res) => {
    db.get(`SELECT id, email, username, plan FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        // IDE expects api_calls and api_limit for canUseAI() check
        const planLimits = { free: 50, pro: 5000, premium: 50000 };
        res.json({
            ...user,
            api_calls: 0,
            api_limit: planLimits[user.plan] || 50
        });
    });
});

// 4. Plan Yükselt (Upgrade)
app.post('/api/auth/upgrade', authenticateToken, (req, res) => {
    const { plan } = req.body;
    const allowedPlans = ['free', 'pro', 'premium'];

    if (!plan || !allowedPlans.includes(plan)) {
        return res.status(400).json({ error: 'Geçersiz paket adı.' });
    }

    db.run(`UPDATE users SET plan = ? WHERE id = ?`, [plan, req.user.id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Plan güncellenemedi.' });
        }
        res.json({ success: true, plan });
    });
});

// --- SECURE AI COMPLETIONS API PROXY ---

app.post('/api/chat/completions', authenticateToken, async (req, res) => {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-ce616de0e52c4324b55205af422506ef';

        // Forward request payload to DeepSeek API
        const dsResponse = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body)
        });

        if (!dsResponse.ok) {
            const errText = await dsResponse.text();
            console.error('DeepSeek API error response:', errText);
            return res.status(dsResponse.status).send(errText);
        }

        // Set streaming response headers
        res.setHeader('Content-Type', dsResponse.headers.get('Content-Type') || 'text/event-stream');
        if (dsResponse.headers.get('Cache-Control')) res.setHeader('Cache-Control', dsResponse.headers.get('Cache-Control'));
        if (dsResponse.headers.get('Connection')) res.setHeader('Connection', dsResponse.headers.get('Connection'));

        // Stream the response back to VS Code Client
        const reader = dsResponse.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch (error) {
        console.error('Chat completions proxy error:', error);
        res.status(500).json({ error: 'Yapay zeka yanıtı alınırken sunucuda bir hata oluştu.' });
    }
});

// --- AUTO UPDATER API ---
app.get(['/api/update/:platform/:quality/:commit', '/api/update/api/update/:platform/:quality/:commit'], async (req, res) => {
    const { platform, quality, commit } = req.params;
    console.log(`Update check from platform: ${platform}, quality: ${quality}, commit: ${commit}`);
    
    try {
        // Fetch the latest release from GitHub
        const ghResponse = await fetch('https://api.github.com/repos/TolgaCulfa1/KeepCodeAi-Exe/releases/tags/latest', {
            headers: {
                'User-Agent': 'KeepCodeAI-Update-Server',
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!ghResponse.ok) {
            console.log('GitHub API request failed, no update available.');
            return res.status(204).end();
        }

        const release = await ghResponse.json();
        
        // Find the Windows Installer asset
        const exeAsset = release.assets.find(a => a.name.endsWith('.exe'));
        
        if (!exeAsset) {
            console.log('No Windows EXE found in the latest release.');
            return res.status(204).end();
        }

        // Compare commit hashes if possible. If the release has the commit hash in the body or target_commitish, we can check.
        // For simplicity, if we don't have a way to match commits exactly, we can check the published_at date or release name.
        // Let's assume if the release was published after the user's build, it's new. But VS Code relies on the 'version' or 'name' string being different.
        
        // Construct the update payload expected by VS Code
        const updatePayload = {
            url: exeAsset.browser_download_url,
            name: release.name || 'Latest Update',
            version: release.tag_name,
            productVersion: release.tag_name,
            hash: '', 
            timestamp: new Date(release.published_at).getTime(),
            sha256hash: '', 
        };

        // Note: VS Code will prompt to update if the 'version' returned here is different from its current version.
        // If it's the same version, we should ideally return 204.
        // For now, returning 200 OK will trigger the update if the version differs.
        res.json(updatePayload);
    } catch (err) {
        console.error('Update server error:', err);
        res.status(204).end();
    }
});

// SPA (Single Page Application) routing fallback: Serve index.html for all other routes
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`KeepCode AI Backend is running on port ${PORT}`);
});
