import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import { storageService } from './services/storage';
import { supabase } from './services/supabase';
import { getOptimizedImageUrl } from './utils/image';

// Lazy loading dos componentes pesados
const UserForm = React.lazy(() => import('./components/UserForm'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));

// Componente Wrapper para Header/Footer condicional
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Verifica se estamos na Landing Page (rota raiz) para mudar o estilo do header
  const isLandingPage = location.pathname === '/';

  // URLs originais
  const rawLogoSrc = isLandingPage 
    ? "https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/logo_sem_fundo.png"
    : "https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/logo_baner_claro.png";

  // Aplica otimização: Largura 300px é suficiente para o header
  const logoSrc = getOptimizedImageUrl(rawLogoSrc, 300);

  useEffect(() => {
    // 1. Check initial session
    storageService.getSession().then(session => {
        setIsAdmin(!!session);
    });

    // 2. Listen for auth changes (real-time)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, [location]);

  // Fecha o menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await storageService.signOut();
    window.location.reload();
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Fecha menu mobile ao clicar
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLandingPage ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b no-print transition-colors ${
        isLandingPage 
          ? 'bg-slate-900/95 backdrop-blur border-slate-800 fixed w-full top-0 z-50' 
          : 'bg-white border-slate-200 sticky top-0 z-40'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-2 group z-50">
            <img 
              src={logoSrc}
              alt="Logo PonteDigital" 
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-4">
            {isLandingPage && (
              <nav className="hidden md:flex gap-6 mr-4">
                <a href="#journey" onClick={(e) => scrollToSection(e, 'journey')} className="text-sm font-medium hover:text-indigo-400 transition-colors">Sobre</a>
                <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="text-sm font-medium hover:text-indigo-400 transition-colors">Portfólio</a>
                <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-sm font-medium hover:text-indigo-400 transition-colors">Serviços</a>
                <a href="#start-project" onClick={(e) => scrollToSection(e, 'start-project')} className="text-sm font-medium hover:text-indigo-400 transition-colors">Seu Projeto</a>
                <a href="#contact-channels" onClick={(e) => scrollToSection(e, 'contact-channels')} className="text-sm font-medium hover:text-indigo-400 transition-colors">Contato</a>
              </nav>
            )}

            {/* Mobile Menu Toggle */}
            {isLandingPage && (
              <button 
                className="md:hidden text-2xl p-2 z-50 focus:outline-none" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menu"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            )}

            {isAdmin ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/admin" className={`text-sm font-medium hover:text-indigo-500 ${isLandingPage ? 'text-slate-300' : 'text-slate-600'}`}>Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isLandingPage 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:block text-sm font-medium text-slate-500 hover:text-indigo-500"
                title="Acesso Administrativo"
              >
                <i className="fas fa-lock"></i>
              </Link>
            )}
            
            <Link 
              to="/requirements"
              className={`hidden md:inline-flex px-4 py-2 text-sm font-bold rounded-full transition-all shadow-lg transform hover:scale-105 items-center ${
                isLandingPage
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <i className="fas fa-lightbulb mr-2"></i>
              Tenho uma Ideia
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isLandingPage && (
          <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
             <nav className="flex flex-col items-center space-y-6 text-xl font-medium">
                <a href="#journey" onClick={(e) => scrollToSection(e, 'journey')} className="hover:text-indigo-400 transition-colors">Sobre</a>
                <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="hover:text-indigo-400 transition-colors">Portfólio</a>
                <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-indigo-400 transition-colors">Serviços</a>
                <a href="#contact-channels" onClick={(e) => scrollToSection(e, 'contact-channels')} className="hover:text-indigo-400 transition-colors">Contato</a>
             </nav>
             <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
             <Link 
              to="/requirements"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2"
            >
              <i className="fas fa-lightbulb"></i> Tenho uma Ideia
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white mt-4">Acessar Dashboard</Link>
            )}
          </div>
        )}
      </header>

      <main className={`flex-grow ${isLandingPage ? 'pt-0' : 'pt-6'}`}>
        <Suspense fallback={
          <div className="h-96 w-full flex items-center justify-center">
            <i className="fas fa-circle-notch fa-spin text-3xl text-indigo-500"></i>
          </div>
        }>
          {children}
        </Suspense>
      </main>

      <footer className={`border-t py-8 no-print ${
        isLandingPage ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Igor Matos. Todos os direitos reservados.
          </p>
          <p className="text-xs mt-2 opacity-60">
            Powered by PonteDigital
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  // Removemos o isLoading global bloqueante. O site carrega, e o auth acontece em background.

  useEffect(() => {
    // Initial check
    storageService.getSession().then(session => {
        setIsAdmin(!!session);
    });

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/requirements" element={<UserForm />} />
            <Route 
              path="/login" 
              element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={() => {}} />} 
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Layout>
      </HashRouter>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;