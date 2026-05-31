import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Code, Sparkles } from 'lucide-react';

export default function Dogrulandi() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const ideToken = searchParams.get('TOKEN');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login' + (ideToken ? `?TOKEN=${ideToken}` : ''));
    }
  }, [navigate, ideToken]);

  const handleReturnToIDE = () => {
    const userToken = localStorage.getItem('token');
    const redirectUrl = `keepcodeai://auth/callback?token=${userToken}&ideToken=${ideToken}`;
    window.location.href = redirectUrl;
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
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="success-icon">
              <CheckCircle />
            </div>
            <h1>Doğrulama Başarılı!</h1>
            <p className="subtitle" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
              KeepCode AI hesabınız başarıyla doğrulandı.<br />
              Geliştirme ortamınıza dönmek için aşağıdaki butona tıklayın.
            </p>
            
            <button onClick={handleReturnToIDE} className="btn-primary">
              <Sparkles style={{ width: 18, height: 18 }} />
              <span>KeepCode AI ile Devam Et</span>
              <ExternalLink style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
