import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Copy, Check, Activity, CreditCard, ArrowRight, 
  Zap, Download, LogOut, Key, User, Shield, RefreshCw,
  Settings, Server, HelpCircle, HardDrive, BarChart3, 
  Mail, Calendar, Lock, Eye, EyeOff, TrendingUp, TrendingDown,
  AlertCircle, Bell, Search, Filter, MoreVertical, ChevronRight,
  Cpu, Globe, Clock, Award, Target, Layers, Terminal, GitBranch
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  
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
    
    setTimeout(() => {
      setUser(prev => ({ ...prev, username: newUsername }));
      setMessage('Profil bilgileriniz başarıyla güncellendi.');
      setSettingsLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-widest text-zinc-550">KONSOL YÜKLENİYOR</span>
            <span className="text-[10px] text-zinc-600">Bağlantı kontrol ediliyor...</span>
          </div>
        </div>
      </div>
    );
  }

  const apiPercentage = user ? Math.min(100, Math.round((user.api_calls / user.api_limit) * 100)) : 0;
  const isPlanUnlimited = user.plan === 'premium';

  const recentActivities = [
    { action: 'API İsteği', time: '2 dakika önce', icon: Terminal },
    { action: 'Profil Güncellendi', time: '1 saat önce', icon: User },
    { action: 'Yeni Anahtar Oluşturuldu', time: '3 saat önce', icon: Key },
    { action: 'Plan Yükseltildi', time: '1 gün önce', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans flex flex-col antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#18181b] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white border border-zinc-800">
              <Code size={16} className="text-zinc-350" />
            </div>
            <div className="flex flex-col" style={{ lineHeight: '1.2' }}>
              <span className="font-bold tracking-tight text-xs text-white">KeepCode AI</span>
              <span className="text-[8px] text-zinc-500 font-bold tracking-wider">CONSOLE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#09090b] border border-zinc-800 rounded-md px-2.5 py-1 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-zinc-400 font-medium text-[10px]">{user.email}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-white bg-[#09090b] hover:bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md transition-all"
            >
              <LogOut size={11} />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Area */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-48 shrink-0">
          <div className="sticky top-20 flex flex-col gap-4">
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-1.5 flex flex-col gap-1">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: Server },
                { id: 'api_keys', label: 'API Anahtarları', icon: Key },
                { id: 'usage', label: 'Kullanım Raporları', icon: Activity },
                { id: 'billing', label: 'Plan & Ödeme', icon: CreditCard },
                { id: 'settings', label: 'Hesap Ayarları', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                      activeTab === item.id 
                        ? 'bg-zinc-800 text-white border border-zinc-700' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40 border border-transparent'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 shadow-sm text-xs">
              <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1.5">
                <span className="text-[9px] font-bold text-zinc-500 tracking-wider">İSTATİSTİK</span>
                <TrendingUp size={11} className="text-emerald-500" />
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Bugün</span>
                  <span className="font-bold text-white">{user.api_calls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Bu Hafta</span>
                  <span className="font-bold text-white">{Math.round(user.api_calls * 4.2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Hata Payı</span>
                  <span className="font-bold text-emerald-500">0.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Notifications */}
          {message && (
            <div className="bg-[#18181b] border border-emerald-500/25 text-emerald-400 rounded-lg p-3 text-xs font-bold flex items-center gap-2">
              <Check size={13} className="shrink-0 text-emerald-500" />
              <span>{message}</span>
            </div>
          )}

          {errMessage && (
            <div className="bg-[#18181b] border border-red-500/25 text-red-400 rounded-lg p-3 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{errMessage}</span>
            </div>
          )}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2">
              
              {/* Welcome Card */}
              <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-sm font-bold text-white">Merhaba, {user.username || 'Geliştirici'}</h1>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Hesabınızı ve API kullanım oranlarınızı bu panel üzerinden kolayca inceleyebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#09090b] border border-zinc-800 rounded-md px-2.5 py-1 shrink-0">
                  <Zap size={12} className="text-zinc-450" />
                  <span className="text-[9px] font-bold text-zinc-350 tracking-wider">PLAN: {user.plan.toUpperCase()}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'KULLANILAN İSTEK', value: user.api_calls, icon: Activity },
                  { label: 'PLAN LİMİTİ', value: isPlanUnlimited ? 'Sınırsız' : user.api_limit, icon: Target },
                  { label: 'KALAN KOTA', value: isPlanUnlimited ? 'Sınırsız' : Math.max(0, user.api_limit - user.api_calls), icon: Layers },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-[#18181b] border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider">{stat.label}</span>
                        <div className="text-lg font-bold text-white mt-1">{stat.value}</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#09090b] flex items-center justify-center border border-zinc-800">
                        <Icon size={14} className="text-zinc-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Usage Progress */}
              <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">KULLANIM ANALİZİ</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-md font-bold text-white">{isPlanUnlimited ? '0%' : `${apiPercentage}%`}</div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#09090b] rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-zinc-500 rounded-full transition-all duration-500"
                    style={{ width: `${isPlanUnlimited ? 0 : apiPercentage}%` }}
                  />
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl flex flex-col">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">SON İŞLEMLER</h3>
                  </div>
                  <div className="space-y-2">
                    {recentActivities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#09090b] border border-zinc-800 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-[#18181b] flex items-center justify-center border border-zinc-800">
                              <Icon size={12} className="text-zinc-450" />
                            </div>
                            <div className="flex flex-col" style={{ lineHeight: '1.2' }}>
                              <span className="text-[11px] font-semibold text-zinc-200">{activity.action}</span>
                              <span className="text-[9px] text-zinc-500">{activity.time}</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-500 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">OK</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">HIZLI YÖNLENDİRME</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'API Key Al', icon: Key, action: () => setActiveTab('api_keys') },
                      { label: 'Plan Değiştir', icon: Award, action: () => setActiveTab('billing') },
                      { label: 'Grafikler', icon: BarChart3, action: () => setActiveTab('usage') },
                      { label: 'Hesap Ayarları', icon: Settings, action: () => setActiveTab('settings') },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="flex items-center gap-2 p-2.5 bg-[#09090b] border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                        >
                          <Icon size={13} className="text-zinc-450" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                      <Download size={13} className="text-zinc-450" />
                      <span>KeepCode AI IDE İndir</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Masaüstü yapay zeka destekli geliştirme uygulamasının son kararlı sürümünü edinin.
                    </p>
                  </div>
                  <a 
                    href="/downloads/KeepCodeAIUserSetup-x64.exe"
                    className="bg-[#09090b] hover:bg-zinc-950 text-white font-bold text-xs px-4 py-2 rounded-lg border border-zinc-850 transition-all shrink-0"
                  >
                    Masaüstü Kurulumunu İndir (.exe)
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* API KEYS PANEL */}
          {activeTab === 'api_keys' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-xl">
                <div className="border-b border-zinc-800 pb-3 mb-5">
                  <h2 className="text-xs font-bold text-white tracking-wider">IDE BAĞLANTI ANAHTARI</h2>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    KeepCode AI masaüstü istemcisine bağlanıp yapay zekayı yetkilendirmek için gereken anahtar.
                  </p>
                </div>

                <div className="bg-[#09090b] border border-zinc-800 rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-[#18181b] border border-zinc-800 rounded-md px-3 py-2 font-mono text-xs select-all text-zinc-350 min-h-[38px] flex items-center overflow-x-auto">
                      {showToken ? token : '•'.repeat(64)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowToken(!showToken)}
                        className="px-3 rounded-lg bg-[#18181b] hover:bg-zinc-950 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center gap-1 h-9"
                      >
                        {showToken ? 'Gizle' : 'Göster'}
                      </button>
                      <button 
                        onClick={handleCopyToken}
                        className="px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] text-xs font-bold transition-all flex items-center justify-center gap-1 h-9 shrink-0 border border-zinc-300"
                      >
                        {copied ? 'Kopyalandı' : 'Kopyala'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* USAGE PANEL */}
          {activeTab === 'usage' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-xl">
                <div className="border-b border-zinc-800 pb-3 mb-5">
                  <h2 className="text-xs font-bold text-white tracking-wider">KULLANIM DETAYLARI</h2>
                </div>

                {/* Graph */}
                <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-lg">
                  <div className="h-32 flex items-end justify-between gap-3 mb-4 pt-4 border-b border-zinc-800 pb-2">
                    {[
                      { day: 'Pzt', value: 30 },
                      { day: 'Sal', value: 65 },
                      { day: 'Çar', value: 45 },
                      { day: 'Per', value: 80 },
                      { day: 'Cum', value: 60 },
                      { day: 'Cmt', value: 90 },
                      { day: 'Paz', value: 95 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-[#18181b] border border-zinc-800/40 rounded-t overflow-hidden flex flex-col justify-end" style={{ height: '100px' }}>
                          <div 
                            className="bg-zinc-650 rounded-t transition-all duration-500"
                            style={{ height: `${item.value}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* BILLING / PLANS PANEL */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-xl">
                <div className="border-b border-zinc-800 pb-3 mb-6">
                  <h2 className="text-xs font-bold text-white tracking-wider">PLANLAR</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Free Plan */}
                  <div className="border border-zinc-800 rounded-xl p-5 flex flex-col justify-between gap-4 bg-[#09090b]">
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-xs text-zinc-300">Ücretsiz (Free)</span>
                      <span className="text-xl font-bold text-white">$0</span>
                    </div>
                    <button 
                      disabled={user.plan === 'free' || upgradeLoading}
                      onClick={() => handleUpgrade('free')}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-[#18181b] hover:bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      {user.plan === 'free' ? 'Mevcut Plan' : 'Seç'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="border border-zinc-800 rounded-xl p-5 flex flex-col justify-between gap-4 bg-[#09090b]">
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-xs text-zinc-300">Gelişmiş (Pro)</span>
                      <span className="text-xl font-bold text-white">$19</span>
                    </div>
                    <button 
                      disabled={user.plan === 'pro' || upgradeLoading}
                      onClick={() => handleUpgrade('pro')}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-[#09090b]"
                    >
                      {upgradeLoading && user.plan !== 'pro' ? 'Yükleniyor...' : user.plan === 'pro' ? 'Mevcut Plan' : 'Yükselt'}
                    </button>
                  </div>

                  {/* Premium Plan */}
                  <div className="border border-zinc-800 rounded-xl p-5 flex flex-col justify-between gap-4 bg-[#09090b]">
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-xs text-zinc-300">Sınırsız (Premium)</span>
                      <span className="text-xl font-bold text-white">$99</span>
                    </div>
                    <button 
                      disabled={user.plan === 'premium' || upgradeLoading}
                      onClick={() => handleUpgrade('premium')}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-[#18181b] hover:bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      {upgradeLoading && user.plan !== 'premium' ? 'Yükleniyor...' : user.plan === 'premium' ? 'Mevcut Plan' : 'Yükselt'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2">
              
              {/* Profile Section */}
              <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-xl">
                <div className="border-b border-zinc-800 pb-3 mb-5">
                  <h3 className="text-xs font-bold text-white tracking-wider">PROFİL BİLGİLERİ</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Kullanıcı adı bilgilerinizi düzenleyin.</p>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-zinc-550 tracking-wider">KULLANICI ADI</label>
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 opacity-60">
                    <label className="text-[9px] font-bold text-zinc-550 tracking-wider">E-POSTA ADRESİ</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-[#09090b] border border-zinc-850 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 cursor-not-allowed"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={settingsLoading}
                    className="bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-[10px] py-2.5 px-4 rounded-lg transition-all border border-zinc-300"
                  >
                    {settingsLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </form>
              </div>

              {/* Password Section */}
              <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-xl">
                <div className="border-b border-zinc-800 pb-3 mb-5">
                  <h3 className="text-xs font-bold text-white tracking-wider">ŞİFRE DEĞİŞTİR</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Hesabınızın parolasını güncelleyin.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setMessage('Şifreniz başarıyla güncellendi.'); setTimeout(() => setMessage(''), 4000); }} className="space-y-4 max-w-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-zinc-550 tracking-wider">MEVCUT ŞİFRE</label>
                    <input 
                      type={showPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-zinc-550 tracking-wider">YENİ ŞİFRE</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#09090b] border border-zinc-800 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all pr-10"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
                      >
                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-[10px] py-2.5 px-4 rounded-lg transition-all border border-zinc-300"
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
      <footer className="border-t border-zinc-800 py-8 bg-[#18181b] mt-16 text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold">
          <div>
            &copy; {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Gizlilik Politikası</a>
            <a href="/terms" className="hover:text-zinc-300 transition-colors">Kullanım Şartları</a>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1">
              <Shield size={11} />
              <span>SSL Korumalı</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
