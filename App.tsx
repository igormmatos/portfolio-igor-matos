
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import UserForm from './components/UserForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { storageService } from './services/storage';
import { supabase } from './services/supabase';

// Componente Wrapper para Header/Footer condicional
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  // Verifica se estamos na Landing Page (rota raiz) para mudar o estilo do header
  const isLandingPage = location.pathname === '/';

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

  const handleLogout = async () => {
    await storageService.signOut();
    window.location.reload();
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/sign/media/logo_sem_fundo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNzRiZDg2NS01Y2MxLTQ2ZGUtYjUyOC1iMGY4ZDBhMjNiMzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9sb2dvX3NlbV9mdW5kby5wbmciLCJpYXQiOjE3Njg5NDU3NjgsImV4cCI6MTgwMDQ4MTc2OH0.2h7K3D9NFx1wO1VospI5Ix3X8T9uv_3J4WmNAW11ncU" 
              alt="Logo Igor Matos" 
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            {isLandingPage && (
              <nav className="hidden md:flex gap-6 mr-4">
                <a 
                  href="#journey" 
                  onClick={(e) => scrollToSection(e, 'journey')}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Sobre
                </a>
                <a 
                  href="#portfolio" 
                  onClick={(e) => scrollToSection(e, 'portfolio')}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Portfólio
                </a>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, 'services')}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Serviços
                </a>
                <a 
                  href="#start-project"
                  onClick={(e) => scrollToSection(e, 'start-project')}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Seu Projeto
                </a>
                <a 
                  href="#contact-channels" 
                  onClick={(e) => scrollToSection(e, 'contact-channels')}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Contato
                </a>
              </nav>
            )}

            {isAdmin ? (
              <>
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
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-medium text-slate-500 hover:text-indigo-500"
                title="Acesso Administrativo"
              >
                <i className="fas fa-lock"></i>
              </Link>
            )}
            
            <Link 
              to="/requirements"
              className={`px-4 py-2 text-sm font-bold rounded-full transition-all shadow-lg transform hover:scale-105 ${
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
      </header>

      <main className={`flex-grow ${isLandingPage ? 'pt-0' : 'pt-6'}`}>
        {children}
      </main>

      <footer className={`border-t py-8 no-print ${
        isLandingPage ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Igor Matos. Todos os direitos reservados.
          </p>
          <p className="text-xs mt-2 opacity-60">
            Powered by RequirementFlow
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    storageService.getSession().then(session => {
        setIsAdmin(!!session);
        setIsLoading(false);
    });

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-indigo-600"><i className="fas fa-spinner fa-spin text-2xl"></i></div>;
  }

  return (
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
  );
};

export default App;
