import { useNavigate } from 'react-router-dom';
import { 
  Code, ArrowRight, Sparkles, Shield, Cpu, Zap, Download, 
  Terminal, CheckCircle, ChevronRight, Heart, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Landing() {
  const navigate = useNavigate();
  const [downloadCount, setDownloadCount] = useState('1,240+');
  const [latestVersion, setLatestVersion] = useState('v1.104.0');

  useEffect(() => {
    // Try to fetch latest release version from backend API
    const fetchLatestRelease = async () => {
      try {
        const res = await axios.get('/api/update/win32-x64/stable/latest-check');
        if (res.data && res.data.version) {
          setLatestVersion(res.data.version);
        }
      } catch (err) {
        // Fallback to default
        console.log('Using default version info');
      }
    };
    fetchLatestRelease();
  }, []);

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 font-sans flex flex-col relative overflow-hidden selection:bg-indigo-600/30 selection:text-white">
      {/* Background Decorative Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#181922_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-zinc-900/80 bg-[#07080c]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_4px_16px_rgba(99,102,241,0.25)] border border-indigo-400/20">
              <Code size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-md bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">KeepCode AI</span>
              <span className="text-[9px] text-indigo-400 font-medium tracking-widest -mt-0.5">NEXT GEN IDE</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Özellikler</a>
            <a href="#architecture" className="hover:text-zinc-200 transition-colors">Altyapı</a>
            <a href="/pricing" className="hover:text-zinc-200 transition-colors">Fiyatlandırma</a>
            <a href="/docs" className="hover:text-zinc-200 transition-colors">Dökümanlar</a>
          </nav>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => navigate('/auth/login')}
              className="text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-all px-4 py-2"
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => navigate('/auth/register')}
              className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl px-4.5 py-2 transition-all duration-300"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl w-full mx-auto px-6 pt-20 pb-16 text-center z-10 flex flex-col items-center">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-300 font-medium mb-8 backdrop-blur-md animate-[pulse_3s_infinite] shadow-[0_0_20px_rgba(99,102,241,0.08)]">
          <Sparkles size={13} className="text-indigo-400 animate-spin-slow" />
          <span>KeepCode AI {latestVersion} Sürümü Çıktı!</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Yapay Zeka Destekli <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Geleceğin Kod Editörü</span>
        </h1>

        {/* Hero Description */}
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
          Gelişmiş yerel mimarisi ve DeepSeek entegrasyonu ile ultra hızlı kod yazın. 
          KeepCode AI IDE ile akıllı otomatik tamamlama, sohbet asistanı ve MCP entegrasyonu tamamen elinizin altında.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4.5 w-full sm:w-auto mb-16">
          <a 
            href="/downloads/KeepCodeAIUserSetup-x64.exe"
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide"
          >
            <Download size={16} />
            <span>Windows Kurulumunu İndir (.exe)</span>
          </a>
          <button 
            onClick={() => navigate('/auth/register')}
            className="flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-800/80 rounded-xl px-7 py-3.5 font-bold text-sm transition-all duration-300 hover:border-zinc-700"
          >
            <span>Konsola Git</span>
            <ArrowRight size={15} className="text-zinc-400" />
          </button>
        </div>

        {/* Platform Info Badge */}
        <div className="flex items-center gap-6 text-xs text-zinc-500 font-semibold border-t border-b border-zinc-900/60 py-4.5 w-full max-w-md justify-center">
          <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-emerald-500" /> Tamamen Ücretsiz Başlangıç</span>
          <span className="h-4 w-px bg-zinc-900" />
          <span className="flex items-center gap-1.5"><Download size={13} className="text-indigo-400" /> {downloadCount} İndirme</span>
        </div>

        {/* IDE Preview Mockup */}
        <div className="w-full max-w-5xl mt-12 border border-zinc-800/60 bg-zinc-950/30 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="bg-[#0b0c13] rounded-xl overflow-hidden border border-zinc-900 shadow-inner aspect-[16/9] flex flex-col">
            {/* Header bar Mockup */}
            <div className="bg-[#08090d] px-4 py-2 border-b border-zinc-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <span className="text-[10px] text-zinc-600 font-semibold tracking-wider font-mono">keepcode-ai-workspace — KeepCode AI</span>
              <div className="w-16" />
            </div>
            {/* Inner IDE Layout Mockup */}
            <div className="flex-1 flex min-h-0 text-left font-mono text-[11px] text-zinc-400">
              <div className="w-48 bg-[#090a0f] border-r border-zinc-900/60 p-4 hidden md:flex flex-col gap-3 shrink-0">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider">GEZGİN</span>
                <span className="text-zinc-300 flex items-center gap-1.5"><Terminal size={12} className="text-indigo-400" /> app.js</span>
                <span className="text-zinc-500 flex items-center gap-1.5 pl-3">index.html</span>
                <span className="text-zinc-500 flex items-center gap-1.5 pl-3">package.json</span>
              </div>
              <div className="flex-1 p-6 overflow-hidden relative bg-[#07080b]">
                <pre className="text-zinc-300 leading-relaxed">
                  <span className="text-purple-400">const</span> <span className="text-blue-400">keepCode</span> = <span className="text-purple-400">require</span>(<span className="text-green-400">'keepcode-ai'</span>);<br />
                  <span className="text-purple-400">const</span> <span className="text-blue-400">assistant</span> = <span className="text-blue-400">keepCode</span>.<span className="text-yellow-400">initialize</span>();<br /><br />
                  <span className="text-zinc-500">// Yapay zeka asistanını başlat</span><br />
                  <span className="text-blue-400">assistant</span>.<span className="text-yellow-400">onCommand</span>(<span className="text-green-400">'kodu-optimize-et'</span>, <span className="text-purple-400">async</span> (<span className="text-orange-400">code</span>) =&gt; &#123;<br />
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-purple-400">await</span> <span className="text-blue-400">assistant</span>.<span className="text-yellow-400">optimize</span>(<span className="text-orange-400">code</span>);<br />
                  &#125;);
                </pre>
                {/* Floating Chat Assistant mockup */}
                <div className="absolute right-6 bottom-6 w-72 bg-zinc-950 border border-indigo-500/30 rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 border-b border-zinc-900 pb-2 mb-2">
                    <Sparkles size={12} />
                    <span>KeepCode AI Asistanı</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal mb-3">
                    Kodunuza baktım. Hızlı performans için döngüyü asenkron yapıya taşıyalım mı?
                  </p>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg w-full transition-all">
                    Değişikliği Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl w-full mx-auto px-6 py-20 relative z-10 border-t border-zinc-900/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
            Kod Yazma Deneyiminizi Hızlandırın
          </h2>
          <p className="text-sm text-zinc-400">
            KeepCode AI, VS Code mimarisinin kararlılığı ile yapay zekanın yaratıcı gücünü harmanlar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-950/30 border border-zinc-900/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-md font-bold text-zinc-200">Gelişmiş AI Entegrasyonu</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                DeepSeek altyapısını kullanarak doğrudan editörünüzün içinden doğru ve hızlı kod tamamlama ve akıllı refactoring yapın.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/30 border border-zinc-900/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-md font-bold text-zinc-200">Hızlı & Hafif</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                Ultra optimize edilmiş yerel masaüstü yapısıyla yüksek bellek tüketimlerini engeller, saniyeler içinde açılır.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/30 border border-zinc-900/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-md font-bold text-zinc-200">Güvenli Geliştirme</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                Kod gizliliğinize önem verilir. İstekleriniz proxy altyapımız üzerinden güvenle iletilir, kodunuz asla izinsiz kaydedilmez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Detail */}
      <section id="architecture" className="max-w-6xl w-full mx-auto px-6 py-20 relative z-10 border-t border-zinc-900/60 bg-[#07080c]/30 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-md">
            <span className="text-xs font-bold text-indigo-400 tracking-wider">MÜKEMMEL ALTYAPI</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              VS Code Kod Tabanından Güç Alır
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Microsoft VS Code platformunun kararlı katmanları üzerine inşa edilen KeepCode AI, en sevdiğiniz eklentilerle, klavye kısayollarıyla ve tema paketleriyle %100 uyumludur. Sıfırdan alışma süreci gerektirmez.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <CheckCircle size={14} className="text-indigo-400" />
                <span>Uzantılar (Extensions) Desteği</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <CheckCircle size={14} className="text-indigo-400" />
                <span>Entegre Terminal Mimarisi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <CheckCircle size={14} className="text-indigo-400" />
                <span>Hassas Git ve Kaynak Kontrolü</span>
              </div>
            </div>
          </div>
          {/* Right column: Graphic visualization */}
          <div className="flex-1 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl max-w-lg w-full flex flex-col gap-4 font-mono text-xs">
            <span className="text-zinc-500 font-bold text-[10px]">SİSTEM ALTYAPISI</span>
            <div className="flex flex-col gap-2">
              <div className="bg-[#0b0c13] border border-zinc-900 p-3 rounded-lg flex items-center justify-between">
                <span className="text-zinc-300">Masaüstü Arayüz Katmanı</span>
                <span className="text-indigo-400 font-bold">Electron / HTML5</span>
              </div>
              <div className="w-4 h-4 border-l border-zinc-800 ml-6" />
              <div className="bg-[#0b0c13] border border-zinc-900 p-3 rounded-lg flex items-center justify-between">
                <span className="text-zinc-300">KeepCode AI Core API</span>
                <span className="text-indigo-400 font-bold">TypeScript / ESM</span>
              </div>
              <div className="w-4 h-4 border-l border-zinc-800 ml-6" />
              <div className="bg-indigo-600/10 border border-indigo-500/20 p-3 rounded-lg flex items-center justify-between">
                <span className="text-indigo-300 font-bold">Yapay Zeka API Ağ Geçidi</span>
                <span className="text-indigo-400 font-bold">api.keepcodeai.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 bg-[#07080c] relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-600 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <Code size={14} />
            </div>
            <span>&copy; {new Date().getFullYear()} KeepCode AI. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-zinc-400 transition-colors">Fiyatlandırma</a>
            <a href="/docs" className="hover:text-zinc-400 transition-colors">Dökümanlar</a>
            <a href="/terms" className="hover:text-zinc-400 transition-colors">Kullanım Koşulları</a>
            <a href="/privacy" className="hover:text-zinc-400 transition-colors">Gizlilik Politikası</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
