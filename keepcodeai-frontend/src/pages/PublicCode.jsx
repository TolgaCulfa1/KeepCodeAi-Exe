import { useNavigate } from 'react-router-dom';
import { Code, ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';

export default function PublicCode() {
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Security</span>
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
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 relative z-10">
        <article className="bg-zinc-950/40 border border-zinc-900/50 rounded-2xl p-6 md:p-10 backdrop-blur-md">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-8 border-b border-zinc-900 pb-4">
            Açık Kaynak ve Veri Güvenliği
          </h1>
          
          <div className="space-y-6 text-zinc-300 leading-relaxed text-sm">
            <section className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-4">
              <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-zinc-100 mb-1">Kodunuz Asla Eğitime Dahil Edilmez</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  KeepCode AI üzerinden gönderilen hiçbir özel kod bloğu veya dosya içeriği, yapay zeka modellerimizin eğitimi veya optimizasyonu amacıyla kullanılmaz. Kodunuz sizde kalır, sunucularımızda saklanmaz.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">Kamuya Açık Kod Eşleşmeleri</h2>
              <p>
                KeepCode AI, kod tamamlama veya sohbet sırasında kamuya açık açık kaynak kodlu projelerle benzerlik gösteren kod parçacıklarını tespit etme seçeneği sunar. Bu sayede fikri mülkiyet haklarını veya açık kaynak lisans kurallarını (MIT, GPL, Apache) ihlal etme riskinin önüne geçilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">Tam Veri Güvenliği</h2>
              <p>
                Verileriniz yerel bilgisayarınızdan SSL/TLS şifreli bağlantı kanalı ile sunucularımıza taşınır. Sunucularımızda yapılan işlemler tamamen uçtan uca güvenli olup proxy mimarisi ile DeepSeek API'sine yönlendirilir.
              </p>
            </section>
          </div>
        </article>
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
