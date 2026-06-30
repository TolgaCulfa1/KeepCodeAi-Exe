import { useNavigate } from 'react-router-dom';
import { Code, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Terms() {
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Terms</span>
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
            Kullanım Koşulları
          </h1>
          
          <div className="space-y-6 text-zinc-300 leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">1. Kabul Edilme</h2>
              <p>
                KeepCode AI hizmetlerine veya web sitelerine erişerek veya bunları kullanarak, bu Kullanım Koşullarına uymayı kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">2. Hesap Güvenliği</h2>
              <p>
                Size atanan IDE Bağlantı Token'ının (API Anahtarının) gizliliğini korumak sizin sorumluluğunuzdadır. Hesabınız altında gerçekleşen tüm faaliyetlerden tamamen siz sorumlu tutulursunuz. Herhangi bir yetkisiz kullanımı derhal bize bildirmelisiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">3. Adil Kullanım ve API Sınırları</h2>
              <p>
                Seçtiğiniz pakete (Free, Pro veya Enterprise) bağlı olarak belirli API kullanım limitleriniz bulunmaktadır. API isteklerinin kötüye kullanılması, otomatik araçlarla sunucuya aşırı yük bindirilmesi veya sistemin normal işleyişini bozmaya yönelik eylemler hesabınızın askıya alınmasına yol açabilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">4. Fikri Mülkiyet</h2>
              <p>
                KeepCode AI IDE yazılımı, logoları, tasarımları ve sunucu altyapısı KeepTG'ye aittir. Açık kaynak kodlu bileşenler ilgili lisanslarına tabidir. Yapay zeka tarafından üretilen kodların mülkiyeti tamamen size (kullanıcıya) aittir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">5. Sorumluluk Reddi</h2>
              <p>
                KeepCode AI, hizmeti "olduğu gibi" sunmaktadır. Yapay zeka tarafından üretilen kodların doğruluğu, güvenliği veya kararlılığı konusunda garanti verilmez. Üretilen kodların denetlenmesi ve test edilmesi tamamen kullanıcının sorumluluğundadır.
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
