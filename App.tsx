
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import UserForm from './components/UserForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(storageService.isAdminLoggedIn());
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) setIsAdmin(true);
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsAdmin(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 no-print">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-700 transition-colors">
                <i className="fas fa-project-diagram"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                RequirementFlow
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {isAdmin ? (
                <>
                  <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Área do PM
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route 
              path="/login" 
              element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 no-print">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} RequirementFlow. Facilitando a ponte entre ideias e tecnologia.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
