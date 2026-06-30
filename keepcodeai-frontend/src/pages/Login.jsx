import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle, Shield, Zap, Code, Copy, Check } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const ideToken = searchParams.get('TOKEN');

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      if (ideToken) {
        navigate(`/auth/dogrulandi?TOKEN=${ideToken}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [ideToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.token);

      if (ideToken) {
        navigate(`/auth/dogrulandi?TOKEN=${ideToken}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = token;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <div className="auth-bg" />
      <div className="grid-overlay" />
      <div className="auth-container">
        <div className="auth-wrapper">
          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon">
              <Code />
            </div>
            <span className="logo-text">KeepCode AI</span>
          </div>

          {/* Card */}
          <div className="auth-card">
            {token ? (
              /* ── Token Gösterme Ekranı ── */
              <>
                <div className="success-icon">
                  <Check />
                </div>
                <h1>Giriş Başarılı!</h1>
                <p className="subtitle">
                  Aşağıdaki token'ı kopyalayıp KeepCode AI IDE'ye yapıştırın
                </p>

                <div className="token-box">
                  <code className="token-text">{token}</code>
                  <button
                    className="token-copy-btn"
                    onClick={handleCopy}
                    title="Token'ı kopyala"
                  >
                    {copied ? <Check /> : <Copy />}
                  </button>
                </div>

                {copied && (
                  <div className="alert alert-success">
                    <Check />
                    <span>Token panoya kopyalandı!</span>
                  </div>
                )}

                <p className="token-hint">
                  Bu token'ı IDE'nin giriş alanına yapıştırarak hesabınızı bağlayabilirsiniz.
                </p>

                <a
                  href="/downloads/KeepCodeAIUserSetup-x64.exe"
                  className="btn-primary"
                  style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', background: '#10b981' }}
                >
                  <Zap style={{ width: 18, height: 18 }} />
                  <span>KeepCode AI IDE'yi İndir (Windows x64)</span>
                </a>

                <button
                  className="btn-primary"
                  onClick={() => { setToken(null); setEmail(''); setPassword(''); }}
                  style={{ marginTop: '1rem' }}
                >
                  <span>Farklı Hesapla Giriş Yap</span>
                </button>
              </>
            ) : (
              /* ── Giriş Formu ── */
              <>
                <h1>Hoş Geldiniz</h1>
                <p className="subtitle">Hesabınıza giriş yaparak devam edin</p>

                {error && (
                  <div className="alert alert-error">
                    <AlertCircle />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">E-posta Adresi</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-input"
                        placeholder="ornek@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail className="input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Şifre</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Lock className="input-icon" />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`}>
                    {loading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        <span>Giriş Yap</span>
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-switch">
                  Hesabınız yok mu?{' '}
                  <button onClick={() => navigate(`/auth/register${ideToken ? '?TOKEN=' + ideToken : ''}`)}>
                    Kayıt Olun
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Features */}
          <div className="features-strip">
            <div className="feature-item">
              <Shield />
              <span>SSL Korumalı</span>
            </div>
            <div className="feature-item">
              <Zap />
              <span>Hızlı & Güvenli</span>
            </div>
            <div className="feature-item">
              <Code />
              <span>AI Destekli IDE</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Nav Links */}
      <footer className="w-full py-6 text-center text-xs text-zinc-500 relative z-10 flex justify-center flex-wrap gap-6 mt-2">
        <button onClick={() => navigate('/docs')} className="hover:text-zinc-300 transition-colors font-medium">Belgeler (Docs)</button>
        <button onClick={() => navigate('/pricing')} className="hover:text-zinc-300 transition-colors font-medium">Fiyatlandırma</button>
        <button onClick={() => navigate('/terms')} className="hover:text-zinc-300 transition-colors font-medium">Kullanım Koşulları</button>
        <button onClick={() => navigate('/privacy')} className="hover:text-zinc-300 transition-colors font-medium">Gizlilik Politikası</button>
        <button onClick={() => navigate('/public-code')} className="hover:text-zinc-300 transition-colors font-medium">Açık Kaynak</button>
      </footer>
    </>
  );
}
