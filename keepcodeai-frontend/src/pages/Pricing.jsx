import { useNavigate } from 'react-router-dom';
import { Code, ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 font-sans flex flex-col">
      <div className="auth-bg" />
      <div className="grid-overlay" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-[#090a0f]/80 backdrop-filter backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-indigo-500/20">
              <Code size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg text-zinc-100">KeepCode AI</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Pricing</span>
          </div>

          <button
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Geri Dön</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 relative z-10 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl mb-4">
            Geliştirme Hızınızı Artırın
          </h1>
          <p className="text-sm text-zinc-400">
            KeepCode AI, her ölçekten geliştirici ve takım için uygun, esnek ve şeffaf yapay zeka planları sunar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-200">Free</h3>
                <p className="text-xs text-zinc-500 mt-1">Yapay zeka ile kodlamayı deneyimleyin.</p>
              </div>
              <div className="flex items-baseline gap-1 py-2">
                <span className="text-3xl font-extrabold text-zinc-100">$0</span>
                <span className="text-xs text-zinc-500">/ her zaman</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-3 border-t border-zinc-900 pt-4">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-zinc-500" />
                  <span>Aylık 100 Yapay Zeka İsteği</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-zinc-500" />
                  <span>Temel Kod Tamamlama</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-zinc-500" />
                  <span>Masaüstü IDE Entegrasyonu</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-bold transition-all"
            >
              Ücretsiz Başla
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-zinc-950/60 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm relative shadow-[0_0_40px_rgba(99,102,241,0.15)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-500 shadow-sm">
              <Sparkles size={10} />
              <span>EN POPÜLER</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-200">Pro</h3>
                <p className="text-xs text-zinc-500 mt-1">Bireysel profesyonel geliştiriciler için.</p>
              </div>
              <div className="flex items-baseline gap-1 py-2">
                <span className="text-3xl font-extrabold text-zinc-100">$19</span>
                <span className="text-xs text-zinc-500">/ aylık</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-3 border-t border-zinc-900 pt-4">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Aylık 5,000 Yapay Zeka İsteği</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Gelişmiş Sohbet ve Kod Analizi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Yüksek Hızlı Özel Sunucular</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Öncelikli Yeni Özellik Erişimi</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Pro'ya Yükselt
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-200">Enterprise</h3>
                <p className="text-xs text-zinc-500 mt-1">Büyük takımlar ve kurumsal projeler için.</p>
              </div>
              <div className="flex items-baseline gap-1 py-2">
                <span className="text-3xl font-extrabold text-zinc-100">$99</span>
                <span className="text-xs text-zinc-500">/ aylık</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-3 border-t border-zinc-900 pt-4">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-indigo-400" />
                  <span className="font-semibold text-zinc-300">Sınırsız Yapay Zeka İstekleri</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-indigo-400" />
                  <span>Özel Tahsis Edilmiş GPU Sunucuları</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-indigo-400" />
                  <span>Gelişmiş Takım ve Rol Yönetimi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-indigo-400" />
                  <span>7/24 Özel Teknik Destek ve SLA</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-bold transition-all"
            >
              Bizimle İletişime Geçin
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 bg-[#090a0f] mt-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
          <span>© {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.</span>
          <div className="flex gap-4">
            <button onClick={() => navigate('/auth/login')} className="hover:text-zinc-400 transition-colors">Giriş Yap</button>
            <button onClick={() => navigate('/auth/register')} className="hover:text-zinc-400 transition-colors">Kayıt Ol</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
