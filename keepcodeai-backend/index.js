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

// Serve static files from public directory (Frontend React dist files)
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

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

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

        res.setHeader('Content-Type', dsResponse.headers.get('Content-Type') || 'text/event-stream');
        if (dsResponse.headers.get('Cache-Control')) res.setHeader('Cache-Control', dsResponse.headers.get('Cache-Control'));
        if (dsResponse.headers.get('Connection')) res.setHeader('Connection', dsResponse.headers.get('Connection'));

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

// --- COPILOT ENTITLEMENTS / TOKEN ENDPOINTS ---

// 1. Entitlement check (GET /api/token)
app.get('/api/token', authenticateToken, (req, res) => {
    db.get(`SELECT plan FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        
        const plan = user.plan || 'free';
        res.json({
            access_type_sku: plan === 'free' ? 'copilot_free' : 'copilot_pro',
            chat_enabled: true,
            assigned_date: new Date().toISOString(),
            can_signup_for_limited: false,
            copilot_plan: plan,
            organization_login_list: [],
            analytics_tracking_id: `keepcode-${req.user.id}`,
            quota_snapshots: {
                chat: {
                    overage_count: 0,
                    overage_permitted: true,
                    percent_remaining: 100,
                    unlimited: plan !== 'free',
                    quota_remaining: plan === 'free' ? 50 : 5000,
                    has_quota: true
                },
                completions: {
                    overage_count: 0,
                    overage_permitted: true,
                    percent_remaining: 100,
                    unlimited: plan !== 'free',
                    quota_remaining: plan === 'free' ? 50 : 5000,
                    has_quota: true
                }
            }
        });
    });
});

// 2. Token entitlements (GET /api/v3/token)
app.get('/api/v3/token', authenticateToken, (req, res) => {
    // Semicolon-separated key-value pairs formatted string expected by extractFromToken() in defaultAccount.ts
    // editor_preview_features=1;agent_mode=1;mcp=1;cloud_session_storage_enabled=1
    const tokenPayload = 'editor_preview_features=1;agent_mode=1;mcp=1;cloud_session_storage_enabled=1:dummy-sig';
    res.json({
        token: tokenPayload
    });
});

// 3. MCP Registry (GET /api/v1/mcp_registry)
app.get('/api/v1/mcp_registry', authenticateToken, (req, res) => {
    res.json({
        mcp_registries: [
            {
                url: 'https://api.keepcodeai.com/api/v1/mcp_registry',
                registry_access: 'allow_all'
            }
        ]
    });
});

// --- AUTO UPDATER API WITH GITHUB RELEASES CACHING ---
let releaseCache = null;
let lastCacheFetchTime = 0;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

app.get(['/api/update/:platform/:quality/:commit', '/api/update/api/update/:platform/:quality/:commit'], async (req, res) => {
    const { platform, quality, commit } = req.params;
    console.log(`Update check - Platform: ${platform}, Quality: ${quality}, Commit: ${commit}`);
    
    try {
        const now = Date.now();
        if (!releaseCache || (now - lastCacheFetchTime) > CACHE_DURATION_MS) {
            console.log('Fetching latest release from GitHub API...');
            const ghResponse = await fetch('https://api.github.com/repos/TolgaCulfa1/KeepCodeAi-Exe/releases/tags/latest', {
                headers: {
                    'User-Agent': 'KeepCodeAI-Update-Server',
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (ghResponse.ok) {
                releaseCache = await ghResponse.json();
                lastCacheFetchTime = now;
            } else {
                console.warn('GitHub API request failed, status:', ghResponse.status);
            }
        }

        if (!releaseCache) {
            console.log('No release cache available, returning 204');
            return res.status(204).end();
        }
        
        // Find the Windows Installer asset
        const exeAsset = releaseCache.assets.find(a => a.name.endsWith('.exe'));
        
        if (!exeAsset) {
            console.log('No Windows EXE found in the latest release. Returning 204');
            return res.status(204).end();
        }

        // Construct the update payload expected by VS Code
        const updatePayload = {
            url: exeAsset.browser_download_url,
            name: releaseCache.name || 'Latest Update',
            version: releaseCache.tag_name,
            productVersion: releaseCache.tag_name,
            hash: '', 
            timestamp: new Date(releaseCache.published_at).getTime(),
            sha256hash: '', 
        };

        console.log('Returning update payload:', updatePayload.version);
        res.json(updatePayload);
    } catch (err) {
        console.error('Update server error:', err);
        res.status(204).end();
    }
});

// SPA (Single Page Application) routing fallback: Serve index.html for all other routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`KeepCode AI Backend is running on port ${PORT}`);
});
