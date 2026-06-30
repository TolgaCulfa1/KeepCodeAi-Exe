import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle, Check, Code } from 'lucide-react';
import axios from 'axios';

function getPasswordStrength(password) {
  if (!password) return { level: 0, text: '', class: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 2, text: 'Zayıf şifre', class: 'weak' };
  if (score <= 3) return { level: 3, text: 'Orta güçlükte', class: 'medium' };
  return { level: 4, text: 'Güçlü şifre', class: 'strong' };
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const ideToken = searchParams.get('TOKEN');
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const username = email.split('@')[0];
      const res = await axios.post('/api/register', { email, password, username });
      localStorage.setItem('token', res.data.token);

      if (ideToken) {
        navigate(`/auth/dogrulandi?TOKEN=${ideToken}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Kayıt başarısız. Bu e-posta zaten kullanılıyor olabilir.';
      setError(msg);
    } finally {
      setLoading(false);
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
            <h1>Hesap Oluşturun</h1>
            <p className="subtitle">AI destekli geliştirme ortamınıza katılın</p>

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
                    placeholder="En az 6 karakter"
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
                {password && (
                  <>
                    <div className="password-strength">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`strength-bar ${i <= strength.level ? `active ${strength.class}` : ''}`}
                        />
                      ))}
                    </div>
                    <div className="strength-text">{strength.text}</div>
                  </>
                )}
              </div>

              <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`}>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <span>Kayıt Ol</span>
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>veya</span>
            </div>

            <div className="auth-switch">
              Zaten hesabınız var mı?{' '}
              <button onClick={() => navigate(`/auth/login${ideToken ? '?TOKEN=' + ideToken : ''}`)}>
                Giriş Yapın
              </button>
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
