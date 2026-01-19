
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import UserForm from './components/UserForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { storageService } from './services/storage';

// Componente Wrapper para Header/Footer condicional
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  // Verifica se estamos na Landing Page (rota raiz) para mudar o estilo do header
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(storageService.isAdminLoggedIn());
    };
    checkAuth();
    // Adiciona listener para mudanças no storage (login/logout em outras abas ou componentes)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLandingPage ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b no-print transition-colors ${
        isLandingPage 
          ? 'bg-slate-900/95 backdrop-blur border-slate-800 fixed w-full top-0 z-50' 
          : 'bg-white border-slate-200 sticky top-0 z-40'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-colors ${
              isLandingPage ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'
            }`}>
              <i className="fas fa-code"></i>
            </div>
            <span className={`text-xl font-bold ${
              isLandingPage ? 'text-white' : 'text-slate-900'
            }`}>
              Igor<span className="text-indigo-500">Matos</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isLandingPage && (
              <nav className="hidden md:flex gap-6 mr-4">
                <a href="#about" className="text-sm font-medium hover:text-indigo-400 transition-colors">Sobre</a>
                <a href="#services" className="text-sm font-medium hover:text-indigo-400 transition-colors">Serviços</a>
                <a href="#portfolio" className="text-sm font-medium hover:text-indigo-400 transition-colors">Portfólio</a>
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

  useEffect(() => {
    setIsAdmin(storageService.isAdminLoggedIn());
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) setIsAdmin(true);
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/requirements" element={<UserForm />} />
          <Route 
            path="/login" 
            element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} 
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