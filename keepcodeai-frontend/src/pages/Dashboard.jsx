import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Copy, Check, Activity, CreditCard, ArrowRight, 
  Zap, Download, LogOut, Key, User, Shield, RefreshCw,
  Settings, Server, HelpCircle, HardDrive, BarChart3, 
  Mail, Calendar, Lock, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, api_keys, usage, billing, settings
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  
  // Settings Form States
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

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
        setNewUsername(res.data.username || '');
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
    setErrMessage('');
    try {
      await axios.post('/api/auth/upgrade', { plan }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh user details after upgrading
      const userRes = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data);
      setMessage(`Planınız başarıyla ${plan.toUpperCase()} paketine yükseltildi!`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Upgrade failed', err);
      setErrMessage('Yükseltme işlemi gerçekleştirilemedi. Lütfen tekrar deneyin.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setMessage('');
    setErrMessage('');
    
    // Simulate API profile update delay
    setTimeout(() => {
      setUser(prev => ({ ...prev, username: newUsername }));
      setMessage('Profil bilgileriniz başarıyla güncellendi.');
      setSettingsLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-450 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold tracking-wider text-zinc-500">YÜKLENİYOR...</span>
        </div>
      </div>
    );
  }

  const apiPercentage = user ? Math.min(100, Math.round((user.api_calls / user.api_limit) * 100)) : 0;
  const isPlanUnlimited = user.plan === 'premium';

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans flex flex-col antialiased selection:bg-indigo-600/30 selection:text-white">
      
      {/* Header */}
      <header className="border-b border-[#1c1c1f] bg-[#09090b] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-indigo-500/20 shadow-sm">
              <Code size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-zinc-100">KeepCode AI</span>
              <span className="text-[9px] text-zinc-500 font-bold tracking-wider -mt-0.5">CONSOLE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-3.5 py-1 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-zinc-400 font-medium">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 bg-[#18181b] border border-[#27272a] hover:border-zinc-700 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <LogOut size={12} />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-zinc-650 tracking-wider px-3 mb-2 block">KONSOL YÖNETİMİ</span>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'overview' 
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Server size={14} />
            <span>Genel Bakış</span>
          </button>

          <button
            onClick={() => setActiveTab('api_keys')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'api_keys' 
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Key size={14} />
            <span>API Anahtarları</span>
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'usage' 
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Activity size={14} />
            <span>Kullanım Raporları</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'billing' 
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <CreditCard size={14} />
            <span>Plan & Ödeme</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'settings' 
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Settings size={14} />
            <span>Hesap Ayarları</span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Notifications */}
          {message && (
            <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <Check size={14} className="shrink-0 text-emerald-500" />
              <span>{message}</span>
            </div>
          )}

          {errMessage && (
            <div className="bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl p-4 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <Shield size={14} className="shrink-0 text-red-500" />
              <span>{errMessage}</span>
            </div>
          )}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              
              {/* Profile Bar */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-md font-bold tracking-tight text-white">Merhaba, {user.username || 'Geliştirici'}</h1>
                  <p className="text-xs text-zinc-400 mt-1">Hesabınızı ve API kullanım oranlarınızı bu panel üzerinden kolayca inceleyebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-1.5">
                  <Zap size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-bold text-zinc-300 tracking-wider">PLAN: {user.plan.toUpperCase()}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#121214] border border-[#222226] p-5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">KULLANILAN ISTEK</span>
                  <span className="text-xl font-bold text-white">{user.api_calls}</span>
                </div>
                <div className="bg-[#121214] border border-[#222226] p-5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">PLAN LIMITI</span>
                  <span className="text-xl font-bold text-white">{isPlanUnlimited ? 'Sınırsız' : user.api_limit}</span>
                </div>
                <div className="bg-[#121214] border border-[#222226] p-5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">KALAN KOTA</span>
                  <span className="text-xl font-bold text-white">{isPlanUnlimited ? 'Sınırsız' : Math.max(0, user.api_limit - user.api_calls)}</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 tracking-wider">
                  <span>API KULLANIM ORANI</span>
                  <span>{isPlanUnlimited ? '0%' : `${apiPercentage}%`}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${isPlanUnlimited ? 0 : apiPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Downloads Card */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-xs font-bold text-zinc-200 tracking-wider mb-1 flex items-center gap-1.5">
                    <Download size={14} className="text-zinc-500" />
                    <span>IDE KURULUM DOSYALARI</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Yapay zeka asistanıyla entegre yerel KeepCode AI masaüstü uygulamasının son kararlı sürümünü edinin.
                  </p>
                </div>
                <a 
                  href="/downloads/KeepCodeAIUserSetup-x64.exe"
                  className="shrink-0 flex items-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white border border-[#27272a] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Download size={13} />
                  <span>Kurulumu İndir (.exe)</span>
                </a>
              </div>

            </div>
          )}

          {/* API KEYS PANEL */}
          {activeTab === 'api_keys' && (
            <div className="flex flex-col gap-6">
              
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col gap-5">
                <div>
                  <h2 className="text-sm font-bold text-zinc-200 tracking-wider mb-1 flex items-center gap-1.5">
                    <Key size={14} className="text-zinc-500" />
                    <span>IDE BAĞLANTI ANAHTARI (API KEY)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    IDE uygulamasında oturum açmak ve yapay zeka özelliklerini yetkilendirmek için bu anahtarı kullanın. Bu anahtarı kimseyle paylaşmamanız güvenliğiniz açısından önemlidir.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 bg-zinc-900 border border-[#27272a] rounded-xl px-4 py-2.5 font-mono text-xs select-all text-zinc-300 min-h-[40px] flex items-center overflow-x-auto">
                    {showToken ? token : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowToken(!showToken)}
                      className="px-3.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-all border border-[#27272a] flex items-center justify-center gap-1.5 h-10"
                    >
                      <span>{showToken ? 'Gizle' : 'Göster'}</span>
                    </button>
                    <button 
                      onClick={handleCopyToken}
                      className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm hover:shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 h-10 shrink-0"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Help Box */}
              <div className="bg-[#121214]/50 border border-[#222226] p-5 rounded-2xl flex gap-3 text-xs leading-relaxed text-zinc-500">
                <HelpCircle size={16} className="text-zinc-650 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-zinc-400">Anahtarımı nasıl kullanırım?</span>
                  <span>1. Yukarıdaki bağlantı anahtarını kopyalayın.</span>
                  <span>2. KeepCode AI editörünü açıp sol alt köşedeki "Giriş Yap" butonuna tıklayın.</span>
                  <span>3. Açılan kutuya bu anahtarı yapıştırıp onaylayın. Sisteminiz anında yetkilendirilecektir.</span>
                </div>
              </div>

            </div>
          )}

          {/* USAGE PANEL */}
          {activeTab === 'usage' && (
            <div className="flex flex-col gap-6">
              
              {/* Usage Cards */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col gap-6">
                <div>
                  <h2 className="text-sm font-bold text-zinc-200 tracking-wider mb-1 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-zinc-500" />
                    <span>DETAYLI KULLANIM DETAYLARI</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Geçerli döneme ait günlük API istek miktarlarını ve kota limit aşım analizlerini takip edin.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block tracking-wider">BUGÜNKÜ ISTEK</span>
                      <span className="text-lg font-bold text-white mt-1 block">{user.api_calls}</span>
                    </div>
                    <Activity size={18} className="text-zinc-600" />
                  </div>
                  <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block tracking-wider">RESET DÖNEMİ</span>
                      <span className="text-lg font-bold text-white mt-1 block">Aylık</span>
                    </div>
                    <Calendar size={18} className="text-zinc-600" />
                  </div>
                </div>

                {/* Graph Mockup */}
                <div className="bg-[#09090b] border border-[#222226] p-4 rounded-xl flex flex-col gap-4 font-mono text-[10px] text-zinc-650">
                  <span className="font-bold tracking-wider text-zinc-500">SON 7 GÜNLÜK API AKIŞ GRAFİĞİ</span>
                  <div className="h-32 flex items-end justify-between gap-1 pt-4 border-b border-[#222226] pb-2">
                    <div className="w-full bg-zinc-900 rounded-t h-4 flex flex-col justify-end"><div className="bg-indigo-500/20 rounded-t h-2" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-12 flex flex-col justify-end"><div className="bg-indigo-500/40 rounded-t h-6" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-8 flex flex-col justify-end"><div className="bg-indigo-500/30 rounded-t h-4" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-20 flex flex-col justify-end"><div className="bg-indigo-500/60 rounded-t h-12" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-16 flex flex-col justify-end"><div className="bg-indigo-500/50 rounded-t h-10" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-24 flex flex-col justify-end"><div className="bg-indigo-500/70 rounded-t h-18" /></div>
                    <div className="w-full bg-zinc-900 rounded-t h-28 flex flex-col justify-end"><div className="bg-indigo-500/90 rounded-t h-24" /></div>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Pzt</span>
                    <span>Sal</span>
                    <span>Çar</span>
                    <span>Per</span>
                    <span>Cum</span>
                    <span>Cmt</span>
                    <span>Paz</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* BILLING / PLANS PANEL */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold text-zinc-200 tracking-wider flex items-center gap-1.5">
                  <CreditCard size={14} className="text-zinc-500" />
                  <span>KULLANIM PLANLARI VE ABONELİK</span>
                </h2>
                <p className="text-xs text-zinc-550">Geliştirme hızınıza uygun, güçlü AI yetenekleriyle donatılmış planlarımız.</p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Free Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all bg-[#121214] ${
                  user.plan === 'free' ? 'border-indigo-500 shadow-sm' : 'border-[#222226]'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-300">Ücretsiz (Free)</span>
                      {user.plan === 'free' && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">AKTİF</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 py-1">
                      <span className="text-2xl font-extrabold text-white">$0</span>
                      <span className="text-[10px] text-zinc-650">/ her zaman</span>
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-3">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-zinc-500" />
                        <span>Aylık 50 AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-zinc-500" />
                        <span>Temel AI Modelleri</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    disabled={user.plan === 'free' || upgradeLoading}
                    onClick={() => handleUpgrade('free')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      user.plan === 'free'
                        ? 'bg-zinc-900/40 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        : 'bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a]'
                    }`}
                  >
                    Mevcut Plan
                  </button>
                </div>

                {/* Pro Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all bg-[#121214] ${
                  user.plan === 'pro' ? 'border-indigo-500 shadow-sm' : 'border-[#222226]'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-300">Gelişmiş (Pro)</span>
                      {user.plan === 'pro' && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">AKTİF</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 py-1">
                      <span className="text-2xl font-extrabold text-white">$19</span>
                      <span className="text-[10px] text-zinc-650">/ aylık</span>
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-3">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Aylık 5,000 AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500" />
                        <span>Hızlı Kod Tamamlama</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    disabled={user.plan === 'pro' || upgradeLoading}
                    onClick={() => handleUpgrade('pro')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      user.plan === 'pro'
                        ? 'bg-zinc-900/40 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {upgradeLoading && user.plan !== 'pro' ? 'Yükleniyor...' : 'Pro Planına Geç'}
                  </button>
                </div>

                {/* Premium Plan */}
                <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all bg-[#121214] ${
                  user.plan === 'premium' ? 'border-indigo-500 shadow-sm' : 'border-[#222226]'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-300">Sınırsız (Premium)</span>
                      {user.plan === 'premium' && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">AKTİF</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 py-1">
                      <span className="text-2xl font-extrabold text-white">$99</span>
                      <span className="text-[10px] text-zinc-650">/ aylık</span>
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900 pt-3">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span className="font-medium text-zinc-300">Sınırsız AI İstek</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-indigo-400" />
                        <span>En Hızlı Özel Hat</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    disabled={user.plan === 'premium' || upgradeLoading}
                    onClick={() => handleUpgrade('premium')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      user.plan === 'premium'
                        ? 'bg-zinc-900/40 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        : 'bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a]'
                    }`}
                  >
                    {upgradeLoading && user.plan !== 'premium' ? 'Yükleniyor...' : 'Premium Plana Geç'}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-6">
              
              {/* Profile details */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col gap-5">
                <h2 className="text-sm font-bold text-zinc-200 tracking-wider flex items-center gap-1.5 border-b border-[#222226] pb-3">
                  <User size={14} className="text-zinc-500" />
                  <span>PROFİL BİLGİLERİNİ GÜNCELLE</span>
                </h2>
                
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider">KULLANICI ADI</label>
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-zinc-900 border border-[#27272a] hover:border-zinc-700 focus:border-zinc-600 outline-none rounded-xl px-4 py-2 text-xs font-medium text-white transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 opacity-60">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider">E-POSTA ADRESİ (DEĞİŞTİRİLEMEZ)</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-xs font-medium text-zinc-500 cursor-not-allowed"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={settingsLoading}
                    className="bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all self-start"
                  >
                    {settingsLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </form>
              </div>

              {/* Password change */}
              <div className="bg-[#121214] border border-[#222226] p-6 rounded-2xl flex flex-col gap-5">
                <h2 className="text-sm font-bold text-zinc-200 tracking-wider flex items-center gap-1.5 border-b border-[#222226] pb-3">
                  <Lock size={14} className="text-zinc-500" />
                  <span>ŞİFRE DEĞİŞTİR</span>
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); setMessage('Şifreniz başarıyla güncellendi.'); setTimeout(() => setMessage(''), 4000); }} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider">MEVCUT ŞİFRE</label>
                    <input 
                      type={showPass ? 'text' : 'password'}
                      className="bg-zinc-900 border border-[#27272a] hover:border-zinc-700 focus:border-zinc-600 outline-none rounded-xl px-4 py-2 text-xs font-medium text-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider">YENİ ŞİFRE</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'}
                        className="w-full bg-zinc-900 border border-[#27272a] hover:border-zinc-700 focus:border-zinc-600 outline-none rounded-xl px-4 py-2 text-xs font-medium text-white transition-all pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all self-start"
                  >
                    Şifreyi Güncelle
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1c1c1f] py-8 bg-[#09090b] mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-zinc-400 transition-colors">Ana Sayfa</a>
            <a href="/pricing" className="hover:text-zinc-400 transition-colors">Fiyatlandırma</a>
            <a href="/docs" className="hover:text-zinc-400 transition-colors">Belgeler</a>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Shield size={12} />
              <span>SSL Korumalı</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
