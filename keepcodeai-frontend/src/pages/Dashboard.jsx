import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Copy, Check, Activity, CreditCard, ArrowRight, 
  Zap, Download, LogOut, Key, User, Shield, RefreshCw 
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, usage, billing
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
        localStorage.removeItem('token');
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = token;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpgrade = async (plan) => {
    setUpgradeLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/auth/upgrade', { plan }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh user details after upgrading
      const userRes = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data);
      setMessage(`Plan başarıyla ${plan} paketine yükseltildi!`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Upgrade failed', err);
      setMessage('Yükseltme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-zinc-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">KeepCode AI Dashboard yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Calculate percentage of API calls
  const apiPercentage = user ? Math.min(100, Math.round((user.api_calls / user.api_limit) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 font-sans flex flex-col antialiased selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-[#090a0f] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm border border-indigo-500/20">
              <Code size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg text-zinc-100">KeepCode AI</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Console</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="hidden sm:inline font-medium">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <LogOut size={13} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Left Navigation */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
            }`}
          >
            <Key size={16} />
            <span>Genel Bakış</span>
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
              activeTab === 'usage' 
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
            }`}
          >
            <Activity size={16} />
            <span>Kullanım (API)</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
              activeTab === 'billing' 
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
            }`}
          >
            <CreditCard size={16} />
            <span>Plan & Abonelik</span>
          </button>
        </div>

        {/* Dynamic Panel */}
        <div className="flex-1 flex flex-col gap-6">
          {message && (
            <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm font-medium flex items-center gap-3 shadow-sm">
              <Check size={16} className="shrink-0 text-emerald-500" />
              <span>{message}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
              
              {/* Profile Welcome Block */}
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-100">Merhaba, Hoş Geldiniz</h1>
                  <p className="text-sm text-zinc-500 mt-1">KeepCode AI Geliştirici Konsolu üzerinden hesabınızı ve lisansınızı yönetin.</p>
                </div>
                <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl">
                  <User size={16} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-zinc-300 tracking-wide">Plan: {user.plan}</span>
                </div>
              </div>

              {/* IDE Auth Token Card */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                    <Key size={16} className="text-zinc-400" />
                    <span>IDE Bağlantı Token'ı (API Anahtarı)</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Bu token'ı KeepCode AI IDE'nizin giriş ekranına yapıştırarak geliştirme ortamınızı yetkilendirebilirsiniz. Güvenliğiniz için bu anahtarı kimseyle paylaşmayın.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-xs select-all text-zinc-300 overflow-x-auto min-h-[42px] flex items-center">
                    {showToken ? token : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <button 
                    onClick={() => setShowToken(!showToken)}
                    className="h-10 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all border border-zinc-800 flex items-center justify-center gap-1.5"
                  >
                    <span>{showToken ? 'Gizle' : 'Göster'}</span>
                  </button>
                  <button 
                    onClick={handleCopyToken}
                    className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm hover:shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Kopyalandı' : 'Tokenı Kopyala'}</span>
                  </button>
                </div>
              </div>

              {/* Download Section Card */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5 max-w-md">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                    <Download size={16} className="text-zinc-400" />
                    <span>KeepCode AI IDE'yi İndirin</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Yapay zeka destekli yerel masaüstü geliştirme editörümüzün en son kararlı sürümünü indirip hemen kodlamaya başlayın.
                  </p>
                </div>

                <a 
                  href="/downloads/KeepCodeAIUserSetup-x64.exe"
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white px-5 py-3 rounded-xl shadow-sm transition-all duration-200 tracking-wide"
                >
                  <Download size={14} />
                  <span>Kurulumu İndir (.exe)</span>
                </a>
              </div>

            </div>
          )}

          {activeTab === 'usage' && (
            <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
              
              {/* API Limit Card */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                    <Activity size={16} className="text-zinc-400" />
                    <span>Yapay Zeka API Kullanım İstatistikleri</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">Mevcut Dönem</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-900/50 p-4 rounded-xl">
                    <span className="text-xs font-medium text-zinc-500 block">Kullanılan İstek</span>
                    <span className="text-xl font-bold text-zinc-100 mt-1 block">{user.api_calls}</span>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-900/50 p-4 rounded-xl">
                    <span className="text-xs font-medium text-zinc-500 block">Toplam Limit</span>
                    <span className="text-xl font-bold text-zinc-100 mt-1 block">
                      {user.api_limit === 9999999 ? 'Sınırsız' : user.api_limit}
                    </span>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-900/50 p-4 rounded-xl col-span-2 md:col-span-1">
                    <span className="text-xs font-medium text-zinc-500 block">Kalan İstek</span>
                    <span className="text-xl font-bold text-zinc-100 mt-1 block">
                      {user.api_limit === 9999999 ? 'Sınırsız' : Math.max(0, user.api_limit - user.api_calls)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-500">
                    <span>Yüzdelik Kullanım</span>
                    <span>{user.api_limit === 9999999 ? '0%' : `${apiPercentage}%`}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-900">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${user.api_limit === 9999999 ? 0 : apiPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
                    *Kullanım limitleriniz seçtiğiniz plana göre belirlenir. Limit aşımında yapay zeka kod asistanı yanıt vermeyi durdurabilir. Limitlerinizi yükseltmek için planınızı güncelleyebilirsiniz.
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'billing' && (
            <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
              
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold tracking-tight text-zinc-200">KeepCode AI Planınızı Seçin</h1>
                <p className="text-xs text-zinc-500">Geliştirme hızınıza uygun, güçlü AI yetenekleriyle donatılmış planlarımız.</p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Free Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-zinc-950 ${
                  user.plan === 'Free' ? 'border-indigo-500' : 'border-zinc-900'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-200">Free</span>
                        {user.plan === 'Free' && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">Aktif</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">AI ile kodlamayı deneyimleyin.</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-100">$0</span>
                      <span className="text-[10px] text-zinc-600">/ her zaman</span>
                    </div>

                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-4">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-zinc-500" />
                        <span>Aylık 100 AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-zinc-500" />
                        <span>Temel AI Modelleri</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-zinc-500" />
                        <span>Masaüstü IDE Entegrasyonu</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    disabled={user.plan === 'Free' || upgradeLoading}
                    onClick={() => handleUpgrade('Free')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      user.plan === 'Free'
                        ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                        : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 border border-zinc-800'
                    }`}
                  >
                    <span>{user.plan === 'Free' ? 'Mevcut Planınız' : 'Free Paketine Geç'}</span>
                  </button>
                </div>

                {/* Pro Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-zinc-950 ${
                  user.plan === 'Pro' ? 'border-indigo-500' : 'border-zinc-900'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-200">Pro</span>
                        {user.plan === 'Pro' && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">Aktif</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Profesyonel geliştiriciler için.</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-100">$19</span>
                      <span className="text-[10px] text-zinc-600">/ aylık</span>
                    </div>

                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-4">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Aylık 5,000 AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Gelişmiş Kod Modelleri</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Öncelikli Altyapı ve Hız</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Erken Erişilebilir Sürümler</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    disabled={user.plan === 'Pro' || upgradeLoading}
                    onClick={() => handleUpgrade('Pro')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      user.plan === 'Pro'
                        ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {upgradeLoading && user.plan !== 'Pro' ? (
                      <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <span>{user.plan === 'Pro' ? 'Mevcut Planınız' : 'Pro Paketine Yükselt'}</span>
                    )}
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-zinc-950 ${
                  user.plan === 'Enterprise' ? 'border-indigo-500' : 'border-zinc-900'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-200">Enterprise</span>
                        {user.plan === 'Enterprise' && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">Aktif</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Geniş takımlar ve ölçeklenebilirlik.</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-100">$99</span>
                      <span className="text-[10px] text-zinc-600">/ aylık</span>
                    </div>

                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-4">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span className="font-medium text-zinc-300">Sınırsız AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span>En Hızlı Özel Altyapı</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span>Takım Yönetim Konsolu</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span>7/24 Özel Destek</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    disabled={user.plan === 'Enterprise' || upgradeLoading}
                    onClick={() => handleUpgrade('Enterprise')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      user.plan === 'Enterprise'
                        ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                        : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 border border-zinc-800'
                    }`}
                  >
                    {upgradeLoading && user.plan !== 'Enterprise' ? (
                      <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <span>{user.plan === 'Enterprise' ? 'Mevcut Planınız' : 'Enterprise\'a Yükselt'}</span>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 bg-[#090a0f] mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-4">
            <a href="https://keepcodeai.com" className="hover:text-zinc-400 transition-colors">Ana Sayfa</a>
            <a href="/docs.html" className="hover:text-zinc-400 transition-colors">Belgeler</a>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Shield size={12} />
              <span>Güvenli Bağlantı (SSL)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
