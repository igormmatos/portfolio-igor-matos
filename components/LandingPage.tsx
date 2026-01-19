
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { SiteContent, PortfolioProject } from '../types';

const LandingPage: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(storageService.getSiteContent());
    setProjects(storageService.getProjects());
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Scroll by one item width (approximate based on responsive sizing)
      const scrollAmount = current.clientWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!content) return null;

  return (
    <div className="bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* HERO SECTION */}
      <section id="about" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto px-4 w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-in slide-in-from-left-8 duration-700 fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-800 text-green-400 text-sm font-semibold mb-6 border border-slate-700">
              Disponível para novos projetos
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Olá, eu sou <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
                {content.profileName}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-6 font-light">
              {content.profileTitle}
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              {content.profileBio}
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href={`https://wa.me/${content.whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
              >
                <i className="fab fa-whatsapp text-xl"></i> Fale Comigo
              </a>
              <a 
                href="#portfolio"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
              >
                Ver Projetos
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center animate-in slide-in-from-right-8 duration-700 fade-in">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Igor&backgroundColor=b6e3f4" 
                alt="Profile" 
                className="relative w-full h-full rounded-full border-4 border-slate-800 shadow-2xl object-cover bg-slate-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Serviços</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-400">Soluções completas para suas necessidades digitais</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <div 
                key={service.id} 
                className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Portfólio</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-400">Projetos recentes e estudos de caso</p>
          </div>

          <div className="relative group">
            {/* Carousel Controls */}
            {projects.length > 1 && (
              <>
                <button 
                  onClick={() => scroll('left')}
                  className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-xl opacity-0 group-hover:opacity-100"
                  aria-label="Anterior"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-xl opacity-0 group-hover:opacity-100"
                  aria-label="Próximo"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {projects.length === 0 ? (
                <div className="w-full text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700 border-dashed">
                  <p className="text-slate-500">Nenhum projeto adicionado ao portfólio ainda.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="min-w-[100%] md:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-22px)] snap-center group/card bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
                  >
                    {/* Project Header/Image Placeholder */}
                    <div className="h-48 bg-slate-700 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                      <i className="fas fa-code text-6xl text-slate-600 group-hover/card:text-slate-500 transition-colors"></i>
                      {project.imageUrl && (
                        <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <div className="p-8">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2 group-hover/card:text-indigo-400 transition-colors">{project.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.split(',').map((tech, idx) => (
                            <span key={idx} className="text-xs font-medium px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-700">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 h-20 overflow-hidden line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex gap-4 mt-auto">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 py-2 text-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <i className="fab fa-github"></i> Código
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 py-2 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-external-link-alt"></i> Online
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (RequirementFlow) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Tem uma ideia de projeto?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Utilize minha ferramenta inteligente para estruturar seus requisitos. É o primeiro passo para transformar sua visão em realidade.
          </p>
          <Link 
            to="/requirements"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-900 font-bold text-lg rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105"
          >
            <i className="fas fa-magic"></i> Estruturar Minha Ideia
          </Link>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${content.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all hover:scale-110 animate-bounce-slow"
        aria-label="Contato via WhatsApp"
      >
        <i className="fab fa-whatsapp text-3xl"></i>
      </a>
    </div>
  );
};

export default LandingPage;
