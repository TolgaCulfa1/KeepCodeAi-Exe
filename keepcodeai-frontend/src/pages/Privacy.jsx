import { useNavigate } from 'react-router-dom';
import { Code, ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Privacy</span>
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
            Gizlilik Politikası
          </h1>
          
          <div className="space-y-6 text-zinc-300 leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">1. Toplanan Veriler</h2>
              <p>
                Hesap oluştururken e-posta adresinizi ve şifrenizi güvenli şifreleme yöntemleriyle (bcrypt) veritabanımızda saklarız. IDE entegrasyonu sırasında gönderdiğiniz yapay zeka istekleri (kod parçacıkları, sohbet metinleri) DeepSeek API sunucularına güvenli SSL kanalları üzerinden proxy yapılarak iletilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">2. Kod Gizliliği Garantisi</h2>
              <p>
                <strong className="text-zinc-100">Kodunuz sizin mülkünüzdür.</strong> KeepCode AI, IDE'den gönderdiğiniz hiçbir kod parçacığını kalıcı olarak sunucularında kaydetmez, depolamaz veya yapay zeka model eğitimi için üçüncü şahıslarla paylaşmaz. Tüm istekler anlık olarak işlenir ve yanıt alındıktan sonra bellekten temizlenir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">3. SSL Şifreleme</h2>
              <p>
                KeepCode AI sunucuları ile IDE'niz arasındaki tüm iletişim endüstri standardı olan SSL/TLS protokolleri ile şifrelenir. Araya girme (MITM) saldırılarına karşı üst düzey koruma sağlanmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">4. Çerezler ve Analitik</h2>
              <p>
                Web sitemizde yalnızca kullanıcı oturumunu yönetmek (JWT) ve temel performansı optimize etmek amacıyla teknik çerezler kullanılmaktadır. Üçüncü taraf reklam çerezleri veya izleyiciler kesinlikle kullanılmamaktadır.
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
