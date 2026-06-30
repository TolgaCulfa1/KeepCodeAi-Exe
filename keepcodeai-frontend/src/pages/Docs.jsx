import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, BookOpen, Key, Download, Cpu, ShieldCheck, ArrowLeft, Menu, X } from 'lucide-react';

export default function Docs() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  const sections = {
    welcome: {
      title: 'KeepCode AI Nedir?',
      content: (
        <>
          <p className="text-zinc-300 leading-relaxed mb-4">
            KeepCode AI, yazılım geliştirme sürecinizi hızlandırmak ve kod kalitenizi artırmak için tasarlanmış, yapay zeka destekli yeni nesil bir entegre geliştirme ortamıdır (IDE). VS Code altyapısı üzerine inşa edilmiş olup, DeepSeek'in en son gelişmiş yapay zeka modelleriyle doğrudan entegre çalışır.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <Cpu className="text-indigo-400 mb-2" size={24} />
              <h4 className="font-semibold text-zinc-200 mb-1">DeepSeek Gücü</h4>
              <p className="text-xs text-zinc-400">En hızlı ve en akıllı kod tamamlama ve sohbet modeli.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <ShieldCheck className="text-indigo-400 mb-2" size={24} />
              <h4 className="font-semibold text-zinc-200 mb-1">SSL ve Gizlilik</h4>
              <p className="text-xs text-zinc-400">Tüm API istekleriniz ve kod verileriniz SSL ile şifrelenir.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <BookOpen className="text-indigo-400 mb-2" size={24} />
              <h4 className="font-semibold text-zinc-200 mb-1">Kolay Entegrasyon</h4>
              <p className="text-xs text-zinc-400">Tek bir erişim anahtarı (Token) ile tüm sistemi bağlayın.</p>
            </div>
          </div>
        </>
      )
    },
    setup: {
      title: 'Kurulum Adımları',
      content: (
        <>
          <ol className="list-decimal list-inside space-y-4 text-zinc-300 mb-6">
            <li>
              <strong className="text-zinc-100">Hesap Oluşturun:</strong>{' '}
              <button onClick={() => navigate('/auth/register')} className="text-indigo-400 hover:underline">Kayıt Ol</button> sayfasından bir hesap oluşturun.
            </li>
            <li>
              <strong className="text-zinc-100">Token'ı Kopyalayın:</strong>{' '}
              Giriş yaptıktan sonra yönlendirileceğiniz Konsol (Dashboard) ekranındaki size özel "IDE Bağlantı Token'ını" kopyalayın.
            </li>
            <li>
              <strong className="text-zinc-100">IDE'yi İndirin ve Kurun:</strong>{' '}
              Dashboard veya Giriş ekranındaki "Kurulumu İndir (.exe)" butonuna tıklayarak kurulum sihirbazını indirin ve bilgisayarınıza kurun.
            </li>
            <li>
              <strong className="text-zinc-100">Token Girişi Yapın:</strong>{' '}
              KeepCode AI uygulamasını çalıştırın. Açılışta sizden istenecek olan Token giriş alanına kopyaladığınız anahtarı yapıştırıp onaylayın.
            </li>
          </ol>
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-400 flex items-start gap-3">
            <ShieldCheck className="shrink-0 mt-0.5" size={18} />
            <span>
              <strong>Güvenlik Notu:</strong> Bağlantı anahtarınız (Token) hesabınızın kimlik doğrulamasıdır. Lütfen bu anahtarı başkalarıyla paylaşmayın.
            </span>
          </div>
        </>
      )
    },
    shortcuts: {
      title: 'Klavye Kısayolları',
      content: (
        <>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Arayüz içindeki yapay zeka özelliklerini hızlıca yönetmek için aşağıdaki kısayolları kullanabilirsiniz:
          </p>
          <div className="border border-zinc-800 rounded-xl overflow-hidden mb-6">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="p-3">Kısayol</th>
                  <th className="p-3">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                <tr>
                  <td className="p-3 font-mono text-xs text-indigo-400">Ctrl + I</td>
                  <td className="p-3">Yapay Zeka Sohbet panelini açar veya satır içi sohbeti tetikler.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-indigo-400">Ctrl + Shift + L</td>
                  <td className="p-3">Seçili kodu yapay zekaya analiz etmesi için gönderir.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-indigo-400">Tab</td>
                  <td className="p-3">Yapay zekanın sunduğu kod tamamlama önerilerini kabul eder.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-indigo-400">Esc</td>
                  <td className="p-3">Aktif yapay zeka önerisini iptal eder veya paneli gizler.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )
    }
  };

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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">Docs</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Geri Dön</span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-zinc-400 hover:text-zinc-200"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar */}
        <aside className={`w-full md:w-56 shrink-0 flex flex-col gap-1.5 transition-all duration-200 md:block ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
          <button
            onClick={() => { setActiveSection('welcome'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${activeSection === 'welcome' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'}`}
          >
            <BookOpen size={16} />
            <span>Giriş</span>
          </button>
          <button
            onClick={() => { setActiveSection('setup'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${activeSection === 'setup' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'}`}
          >
            <Download size={16} />
            <span>Kurulum</span>
          </button>
          <button
            onClick={() => { setActiveSection('shortcuts'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${activeSection === 'shortcuts' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'}`}
          >
            <Key size={16} />
            <span>Klavye Kısayolları</span>
          </button>
        </aside>

        {/* Article content */}
        <article className="flex-1 bg-zinc-950/40 border border-zinc-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6 border-b border-zinc-900 pb-4">
            {sections[activeSection].title}
          </h1>
          <div className="prose prose-invert max-w-none">
            {sections[activeSection].content}
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
