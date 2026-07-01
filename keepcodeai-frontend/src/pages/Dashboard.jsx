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
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-zinc-900 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-b-indigo-700 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-widest text-indigo-400">SİSTEM BAŞLATILIYOR</span>
            <span className="text-[10px] text-zinc-500">Güvenli bağlantı kuruluyor...</span>
          </div>
        </div>
      </div>
    );
  }

  const apiPercentage = user ? Math.min(100, Math.round((user.api_calls / user.api_limit) * 100)) : 0;
  const isPlanUnlimited = user.plan === 'premium';

  const recentActivities = [
    { action: 'API İsteği', time: '2 dakika önce', status: 'success', icon: Terminal },
    { action: 'Profil Güncellendi', time: '1 saat önce', status: 'success', icon: User },
    { action: 'Yeni Anahtar Oluşturuldu', time: '3 saat önce', status: 'success', icon: Key },
    { action: 'Plan Yükseltildi', time: '1 gün önce', status: 'info', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-300 font-sans flex flex-col antialiased selection:bg-indigo-600/30 selection:text-white">
      {/* Background Decorative Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#181922_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900/80 bg-[#07080c]/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white border border-indigo-400/20 shadow-lg">
                <Code size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-sm text-white">KeepCode AI</span>
                <span className="text-[9px] text-indigo-400 font-bold tracking-wider -mt-0.5">DEVELOPER CONSOLE</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-1 ml-8">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0b0c14] border border-zinc-900 hover:border-zinc-800 focus:border-indigo-500/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none transition-all w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-[#111322] rounded-lg transition-colors group border border-transparent hover:border-zinc-900">
              <Bell size={16} className="text-zinc-400 group-hover:text-zinc-200" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>
            
            <div className="flex items-center gap-2 bg-[#0b0c14] border border-zinc-900 rounded-lg px-3.5 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-zinc-400">{user.email}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-[#0b0c14] hover:bg-[#111322] border border-zinc-900 hover:border-zinc-800 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <LogOut size={13} />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-60 shrink-0">
          <div className="sticky top-24 flex flex-col gap-4">
            <div className="bg-[#0b0c14] border border-zinc-900 rounded-xl p-2 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider px-3 py-2 block">KONSOL YÖNETİMİ</span>
              
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
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
                      activeTab === item.id 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111322] border border-transparent'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <ChevronRight size={12} className="ml-auto text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="bg-[#0b0c14] border border-zinc-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider">HIZLI İSTATİSTİK</span>
                <TrendingUp size={12} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Bugün</span>
                  <span className="font-bold text-white">{user.api_calls}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Bu Hafta</span>
                  <span className="font-bold text-white">{Math.round(user.api_calls * 4.2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Başarı Oranı</span>
                  <span className="font-bold text-emerald-500">99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Notifications */}
          {message && (
            <div className="bg-[#0b0c14] border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/20 flex items-center justify-center border border-emerald-500/30">
                <Check size={14} className="text-emerald-400" />
              </div>
              <span>{message}</span>
            </div>
          )}

          {errMessage && (
            <div className="bg-[#0b0c14] border border-red-500/20 text-red-400 rounded-xl p-4 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-lg bg-red-950/20 flex items-center justify-center border border-red-500/30">
                <AlertCircle size={14} className="text-red-400" />
              </div>
              <span>{errMessage}</span>
            </div>
          )}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-[#111322] to-[#0d0f18] border border-indigo-950/40 p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">KONSOL AKTİF</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                      Hoş geldin, {user.username || 'Geliştirici'}
                    </h1>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                      Yapay zeka yetenekleriyle donatılmış asistanını yönet. API kotalarını kontrol et, lisans işlemlerini tamamla ve hemen kodlamaya başla.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#07080c]/90 border border-zinc-900 rounded-xl px-4 py-3 shrink-0">
                    <Zap size={20} className="text-indigo-400 animate-pulse" />
                    <div>
                      <div className="text-[9px] font-bold text-zinc-500 tracking-wider">LİSANS DÜZEYİ</div>
                      <div className="text-xs font-bold text-white">{user.plan.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'KULLANILAN İSTEK', value: user.api_calls, icon: Activity, desc: 'Bu dönem harcanan' },
                  { label: 'PLAN LİMİTİ', value: isPlanUnlimited ? 'Sınırsız' : user.api_limit, icon: Target, desc: 'Maksimum kota sınırı' },
                  { label: 'KALAN KOTA', value: isPlanUnlimited ? 'Sınırsız' : Math.max(0, user.api_limit - user.api_calls), icon: Layers, desc: 'Kalan kullanılabilir miktar' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-[#0b0c14] border border-zinc-900 p-5 rounded-xl hover:border-zinc-800/80 transition-all group flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider">{stat.label}</span>
                        <div className="text-xl font-bold text-white mt-1">{stat.value}</div>
                        <span className="text-[9px] text-zinc-600 mt-1">{stat.desc}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900 group-hover:bg-[#14172a] group-hover:border-zinc-800 transition-all">
                        <Icon size={16} className="text-indigo-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Usage Progress */}
              <div className="bg-[#0b0c14] border border-zinc-900 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">KULLANIM HIZI</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Bu dönemki toplam limit doluluk analizi</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{isPlanUnlimited ? '0%' : `${apiPercentage}%`}</div>
                    <div className="text-[9px] text-zinc-500 tracking-widest font-bold">KULLANIM</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#07080c] rounded-full overflow-hidden border border-zinc-900">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${isPlanUnlimited ? 0 : apiPercentage}%` }}
                  />
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-[#0b0c14] border border-zinc-900 p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">SON İŞLEMLER</h3>
                    <button onClick={() => setActiveTab('usage')} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">TÜMÜ</button>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-[#07080c] border border-zinc-900/60 rounded-xl hover:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#111322] flex items-center justify-center border border-zinc-900">
                              <Icon size={14} className="text-indigo-400" />
                            </div>
                            <div className="flex flex-col" style={{ lineHeight: '1.4' }}>
                              <span className="text-xs font-semibold text-zinc-200">{activity.action}</span>
                              <span className="text-[9px] text-zinc-500">{activity.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[9px] text-zinc-500 font-medium">Başarılı</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0b0c14] border border-zinc-900 p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-zinc-200 tracking-wider">HIZLI YÖNLENDİRME</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Token Kopyala', icon: Key, action: () => setActiveTab('api_keys') },
                      { label: 'Plan Yükselt', icon: Award, action: () => setActiveTab('billing') },
                      { label: 'Analizler', icon: BarChart3, action: () => setActiveTab('usage') },
                      { label: 'Hesap Ayarları', icon: Settings, action: () => setActiveTab('settings') },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="flex flex-col items-center gap-2.5 p-4 bg-[#07080c] border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#111322] flex items-center justify-center group-hover:bg-[#14172a] group-hover:border-zinc-800 transition-all border border-zinc-900">
                            <Icon size={16} className="text-indigo-400 group-hover:scale-105 transition-transform" />
                          </div>
                          <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-gradient-to-r from-[#111322] to-[#0d0f18] border border-indigo-950/40 p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Download size={16} className="text-indigo-400" />
                      <h3 className="text-xs font-bold text-white tracking-wider">KeepCode AI IDE İndir</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-xl">
                      Masaüstü yapay zeka asistanıyla entegre kod geliştirme uygulamasını indirin. Dosyalar her zaman güncel, hızlı ve optimize olarak sunulur.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <HardDrive size={12} className="text-zinc-650" />
                        <span>Windows x64 (~245 MB)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-zinc-650" />
                        <span>Sürüm: v2.4.1</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield size={12} className="text-zinc-650" />
                        <span className="text-emerald-500">Güvenli / İmzalı</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="/downloads/KeepCodeAIUserSetup-x64.exe"
                    className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 border border-indigo-500/20"
                  >
                    <Download size={14} />
                    <span>Kurulumu İndir (.exe)</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* API KEYS PANEL */}
          {activeTab === 'api_keys' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#0b0c14] border border-zinc-900 p-8 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900">
                    <Key size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-white tracking-wider mb-2">IDE Bağlantı Anahtarı</h2>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      KeepCode AI masaüstü istemcisine bağlanıp yapay zekayı etkinleştirmek için gereken kimlik doğrulama anahtarı. Bu anahtarı kimseyle paylaşmamanız güvenliğiniz için zorunludur.
                    </p>
                  </div>
                </div>

                <div className="bg-[#07080c] border border-zinc-900 rounded-xl p-5 mb-4">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                    <span className="text-[9px] font-bold text-zinc-500 tracking-wider">BAĞLANTI TOKEN'I</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] text-zinc-500 font-bold tracking-wider">AKTİF</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-[#0b0c14] border border-zinc-900 rounded-lg px-4 py-3.5 font-mono text-xs select-all text-zinc-300 min-h-[48px] flex items-center overflow-x-auto">
                      {showToken ? token : '•'.repeat(64)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowToken(!showToken)}
                        className="px-4 rounded-lg bg-[#111322] hover:bg-[#14172a] text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-all border border-zinc-900 flex items-center justify-center gap-1.5 h-12"
                      >
                        {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{showToken ? 'Gizle' : 'Göster'}</span>
                      </button>
                      <button 
                        onClick={handleCopyToken}
                        className="px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 h-12 shrink-0 border border-indigo-500/25 shadow-md shadow-indigo-600/10"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#07080c] border border-zinc-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={12} className="text-zinc-600" />
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">ÜRETİM TARİHİ</span>
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">15 Ocak 2026</div>
                  </div>
                  <div className="bg-[#07080c] border border-zinc-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity size={12} className="text-zinc-600" />
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">SON ERİŞİM</span>
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">2 dakika önce</div>
                  </div>
                  <div className="bg-[#07080c] border border-zinc-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={12} className="text-zinc-650" />
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">ŞİFRELEME</span>
                    </div>
                    <div className="text-xs text-emerald-500 font-bold">SHA-256</div>
                  </div>
                </div>
              </div>

              {/* Help Box */}
              <div className="bg-[#0b0c14] border border-zinc-900 p-6 rounded-xl">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#111322] flex items-center justify-center shrink-0 border border-zinc-900">
                    <HelpCircle size={20} className="text-indigo-400" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xs font-bold text-white tracking-wider mb-3">Anahtarımı Nasıl Kullanırım?</h3>
                    <div className="space-y-2.5 text-xs text-zinc-400 leading-relaxed">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#111322] flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-400 border border-zinc-900">1</div>
                        <span className="pt-0.5">Yukarıdaki bağlantı anahtarını (Token) kopyalayın.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#111322] flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-400 border border-zinc-900">2</div>
                        <span className="pt-0.5">KeepCode AI editörünü açıp sol alt köşedeki "Giriş Yap" butonuna tıklayın.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#111322] flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-400 border border-zinc-900">3</div>
                        <span className="pt-0.5">Açılan kutuya bu anahtarı yapıştırıp onaylayın. Sisteminiz anında yetkilendirilecektir.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* USAGE PANEL */}
          {activeTab === 'usage' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#0b0c14] border border-zinc-900 p-8 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900">
                    <BarChart3 size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-white tracking-wider mb-2">Detaylı Kullanım Grafikleri</h2>
                    <p className="text-xs text-zinc-400">Geçerli döneme ait günlük API istek miktarlarını ve performans metriklerini takip edin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#07080c] border border-zinc-900 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">BUGÜN</span>
                      <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{user.api_calls}</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">+12% Artış</div>
                  </div>
                  <div className="bg-[#07080c] border border-zinc-900 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">BU HAFTA</span>
                      <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{Math.round(user.api_calls * 4.2)}</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">+8% Artış</div>
                  </div>
                  <div className="bg-[#07080c] border border-zinc-900 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">BU AY</span>
                      <TrendingDown size={14} className="text-zinc-650" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{Math.round(user.api_calls * 18.5)}</div>
                    <div className="text-[10px] text-zinc-650 font-semibold">-2% Azalma</div>
                  </div>
                </div>

                {/* Graph */}
                <div className="bg-[#07080c] border border-zinc-900 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-200 tracking-wider mb-1">Son 7 Günlük API Akışı</h3>
                      <p className="text-[10px] text-zinc-500">Günlük istek dağılımı</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-[#111322] hover:bg-[#14172a] text-xs font-bold text-indigo-400 rounded-lg transition-colors border border-zinc-900">7G</button>
                      <button className="px-3 py-1.5 hover:bg-[#111322] text-xs font-bold text-zinc-500 rounded-lg transition-colors">30G</button>
                    </div>
                  </div>
                  
                  <div className="h-48 flex items-end justify-between gap-3 mb-4 pt-4 border-b border-zinc-900/60 pb-2">
                    {[
                      { day: 'Pzt', value: 30 },
                      { day: 'Sal', value: 65 },
                      { day: 'Çar', value: 45 },
                      { day: 'Per', value: 80 },
                      { day: 'Cum', value: 60 },
                      { day: 'Cmt', value: 90 },
                      { day: 'Paz', value: 95 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#0b0c14] border border-zinc-900/40 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '140px' }}>
                          <div 
                            className="bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-lg transition-all duration-500 hover:from-indigo-500 hover:to-indigo-400"
                            style={{ height: `${item.value}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{item.day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[9px] font-bold text-zinc-500 tracking-wider">ORTALAMA GÜNLÜK HIZ</div>
                      <div className="text-md font-bold text-white mt-0.5">64 İstek</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-zinc-500 tracking-wider">ZİRVE GÜNÜ</div>
                      <div className="text-md font-bold text-white mt-0.5">Pazar (95 İstek)</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* BILLING / PLANS PANEL */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-[#0b0c14] border border-zinc-900 p-8 rounded-2xl">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900">
                    <CreditCard size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-white tracking-wider mb-2">Kullanım Planları & Abonelik</h2>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Projelerinizin gereksinimlerine göre en uygun KeepCode AI planını seçin. İstediğiniz an yükseltebilir veya değiştirebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Free Plan */}
                  <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-[#07080c] ${
                    user.plan === 'free' ? 'border-indigo-500 shadow-md shadow-indigo-600/5' : 'border-zinc-900 hover:border-zinc-800'
                  }`}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-zinc-300">Ücretsiz (Free)</span>
                        {user.plan === 'free' && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">MEVCUT</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-2xl font-extrabold text-white">$0</span>
                        <span className="text-[10px] text-zinc-650">/ her zaman</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900/60 pt-3">
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
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                        user.plan === 'free'
                          ? 'bg-[#111322] text-zinc-600 border border-zinc-900 cursor-not-allowed'
                          : 'bg-[#111322] hover:bg-[#14172a] text-zinc-300 border border-zinc-900'
                      }`}
                    >
                      {user.plan === 'free' ? 'Mevcut Plan' : 'Seç'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-[#07080c] relative ${
                    user.plan === 'pro' ? 'border-indigo-500 shadow-md shadow-indigo-600/5' : 'border-zinc-900 hover:border-zinc-800'
                  }`}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-indigo-600 text-white text-[9px] font-bold px-3 py-1 rounded-full border border-indigo-500/25">ÖNERİLEN</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-zinc-300">Gelişmiş (Pro)</span>
                        {user.plan === 'pro' && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">MEVCUT</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-2xl font-extrabold text-white">$19</span>
                        <span className="text-[10px] text-zinc-650">/ aylık</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900/60 pt-3">
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
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                        user.plan === 'pro'
                          ? 'bg-[#111322] text-zinc-600 border border-zinc-900 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/20 shadow-md shadow-indigo-600/10'
                      }`}
                    >
                      {upgradeLoading && user.plan !== 'pro' ? 'Yükleniyor...' : user.plan === 'pro' ? 'Mevcut Plan' : 'Pro Planına Geç'}
                    </button>
                  </div>

                  {/* Premium Plan */}
                  <div className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-[#07080c] ${
                    user.plan === 'premium' ? 'border-indigo-500 shadow-md shadow-indigo-600/5' : 'border-zinc-900 hover:border-zinc-800'
                  }`}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-zinc-300">Sınırsız (Premium)</span>
                        {user.plan === 'premium' && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">MEVCUT</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-2xl font-extrabold text-white">$99</span>
                        <span className="text-[10px] text-zinc-650">/ aylık</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-900/60 pt-3">
                        <li className="flex items-center gap-2">
                          <Check size={12} className="text-indigo-400" />
                          <span>Sınırsız AI İstek</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={12} className="text-indigo-400" />
                          <span>Özel Öncelikli Hat</span>
                        </li>
                      </ul>
                    </div>
                    <button 
                      disabled={user.plan === 'premium' || upgradeLoading}
                      onClick={() => handleUpgrade('premium')}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                        user.plan === 'premium'
                          ? 'bg-[#111322] text-zinc-600 border border-zinc-900 cursor-not-allowed'
                          : 'bg-[#111322] hover:bg-[#14172a] text-zinc-300 border border-zinc-900'
                      }`}
                    >
                      {upgradeLoading && user.plan !== 'premium' ? 'Yükleniyor...' : user.plan === 'premium' ? 'Mevcut Plan' : 'Premium Plana Geç'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              
              {/* Profile Section */}
              <div className="bg-[#0b0c14] border border-zinc-900 p-8 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900">
                    <User size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-sm font-bold text-white tracking-wider mb-2">Profil Bilgileri</h2>
                    <p className="text-xs text-zinc-400">Hesap bilgilerinizi güncelleyin ve yönetin.</p>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 tracking-wider block">KULLANICI ADI</label>
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-[#07080c] border border-zinc-900 hover:border-zinc-800 focus:border-indigo-500/50 outline-none rounded-xl px-4 py-3 text-xs font-semibold text-white transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 opacity-60">
                    <label className="text-[9px] font-bold text-zinc-500 tracking-wider block">E-POSTA ADRESİ</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-[#07080c]/60 border border-zinc-900/60 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-500 cursor-not-allowed"
                    />
                    <p className="text-[9px] text-zinc-650 mt-1">E-posta adresi değiştirilemez</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={settingsLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all border border-indigo-500/25 shadow-md shadow-indigo-600/10"
                  >
                    {settingsLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </form>
              </div>

              {/* Password Section */}
              <div className="bg-[#0b0c14] border border-zinc-900 p-8 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#111322] flex items-center justify-center border border-zinc-900">
                    <Lock size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-sm font-bold text-white tracking-wider mb-2">Şifre Değiştir</h2>
                    <p className="text-xs text-zinc-400">Güvenliğiniz için şifrenizi düzenli aralıklarla değiştirin.</p>
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setMessage('Şifreniz başarıyla güncellendi.'); setTimeout(() => setMessage(''), 4000); }} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 tracking-wider block">MEVCUT ŞİFRE</label>
                    <input 
                      type={showPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#07080c] border border-zinc-900 hover:border-zinc-800 focus:border-indigo-500/50 outline-none rounded-xl px-4 py-3 text-xs font-semibold text-white transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 tracking-wider block">YENİ ŞİFRE</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#07080c] border border-zinc-900 hover:border-zinc-800 focus:border-indigo-500/50 outline-none rounded-xl px-4 py-3 text-xs font-semibold text-white transition-all pr-10"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-[9px] text-zinc-650 mt-1">En az 8 karakter, büyük/küçük harf ve rakam içermelidir</p>
                  </div>

                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all border border-indigo-500/25 shadow-md shadow-indigo-600/10"
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
      <footer className="border-t border-zinc-900/60 py-12 bg-[#07080c] relative z-10 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-indigo-500/25 shadow-md">
                <Code size={16} />
              </div>
              <span className="font-extrabold text-sm text-white">KeepCode AI</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mt-2">
              Yapay zeka destekli kodlama asistanınız. Geliştiriciler için tasarlanmış güçlü araçlarla kodlama deneyiminizi bir üst seviyeye taşıyın.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-zinc-600 mt-2 font-semibold">
              <span className="flex items-center gap-1">
                <Shield size={12} />
                <span>SSL Korumalı</span>
              </span>
              <span className="flex items-center gap-1">
                <Globe size={12} />
                <span>Global CDN</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider mb-4">ÜRÜN</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-semibold">
              <li><a href="/" className="hover:text-zinc-300 transition-colors">Ana Sayfa</a></li>
              <li><a href="/pricing" className="hover:text-zinc-300 transition-colors">Fiyatlandırma</a></li>
              <li><a href="/docs" className="hover:text-zinc-300 transition-colors">Dökümantasyon</a></li>
              <li><a href="/api" className="hover:text-zinc-300 transition-colors">API Referans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider mb-4">DESTEK</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-semibold">
              <li><a href="/help" className="hover:text-zinc-300 transition-colors">Yardım Merkezi</a></li>
              <li><a href="/contact" className="hover:text-zinc-300 transition-colors">İletişim</a></li>
              <li><a href="/status" className="hover:text-zinc-300 transition-colors">Sistem Durumu</a></li>
              <li><a href="/community" className="hover:text-zinc-300 transition-colors">Topluluk</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-650 font-medium">
            &copy; {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-500 font-semibold">
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Gizlilik Politikası</a>
            <a href="/terms" className="hover:text-zinc-300 transition-colors">Kullanım Şartları</a>
            <a href="/cookies" className="hover:text-zinc-300 transition-colors">Çerezler</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
