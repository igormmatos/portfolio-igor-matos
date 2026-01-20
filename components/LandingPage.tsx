
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
      const scrollAmount = current.clientWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getColorClasses = (theme: string) => {
    switch(theme) {
      case 'blue': return { iconBg: 'bg-blue-900/30', iconText: 'text-blue-400', check: 'text-blue-500' };
      case 'cyan': return { iconBg: 'bg-cyan-900/30', iconText: 'text-cyan-400', check: 'text-cyan-500' };
      default: return { iconBg: 'bg-indigo-900/30', iconText: 'text-indigo-400', check: 'text-indigo-500' };
    }
  };

  if (!content) return null;

  return (
    <div className="bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden border-b border-slate-800">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto px-4 w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-in slide-in-from-left-8 duration-700 fade-in">
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-sm text-green-400 text-xs font-bold uppercase tracking-wider mb-8">
              <i className="fas fa-circle text-[8px] mr-2 align-middle"></i> Disponível para novos projetos
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-white">
              Olá, eu sou {content.profileName} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {content.profileTitle}
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-300 font-light mb-6">
              Transformando desafios em resultados com tecnologia e liderança.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              {content.profileBio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#journey"
                onClick={(e) => scrollToSection(e, 'journey')} 
                className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 text-center flex items-center justify-center gap-2"
              >
                <i className="fab fa-linkedin text-lg"></i>
                Ver Perfil Profissional
              </a>
              <a 
                href="#services"
                onClick={(e) => scrollToSection(e, 'services')} 
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 text-center"
              >
                Contratar Meus Serviços
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center animate-in slide-in-from-right-8 duration-700 fade-in">
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-blue-600/30 rounded-full blur-3xl opacity-40"></div>
              {/* Profile Image with subtle styling */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-800/50">
                 <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Igor&backgroundColor=1e293b&clothing=blazerAndShirt&eyes=happy" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JORNADA / SOBRE MIM */}
      <section id="journey" className="py-24 bg-slate-900 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Minha Jornada</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-400 text-lg">Tecnologia, Liderança e Resultados</p>
          </div>

          <div className="space-y-12">
            {/* 2C Sistemas */}
            <div className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
              <div className="md:flex items-start gap-6 group">
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <div className="h-full w-0.5 bg-slate-800 my-2"></div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-1 hover:border-indigo-500/30 transition-colors">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Project Manager & Arquiteto</h3>
                      <span className="text-indigo-400 font-mono text-sm">2C SISTEMAS</span>
                   </div>
                   <p className="text-slate-400 leading-relaxed">
                     Liderei a arquitetura de sistemas complexos, desde o design de banco de dados até o backend e infraestrutura. 
                     Atuei na definição de requisitos e na gestão ágil de equipes de desenvolvimento, garantindo entregas robustas e escaláveis.
                   </p>
                </div>
              </div>
            </div>

            {/* Embrapa */}
            <div className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
              <div className="md:flex items-start gap-6 group">
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <div className="h-full w-0.5 bg-slate-800 my-2"></div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-1 hover:border-indigo-500/30 transition-colors">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Parceria Embrapa & Cotemig</h3>
                      <span className="text-indigo-400 font-mono text-sm">PROJETO DE INOVAÇÃO</span>
                   </div>
                   <p className="text-slate-400 leading-relaxed">
                     Desenvolvimento de sistema de gestão de tarefas voltado para o setor lácteo. 
                     O projeto focou na otimização de processos produtivos, unindo tecnologia de ponta com as necessidades do campo.
                   </p>
                </div>
              </div>
            </div>

            {/* Military */}
            <div className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
              <div className="md:flex items-start gap-6 group">
                <div className="hidden md:flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i className="fas fa-medal"></i>
                  </div>
                  <div className="h-full w-0.5 bg-slate-800 my-2"></div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-1 hover:border-indigo-500/30 transition-colors">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Liderança Militar & Logística</h3>
                      <span className="text-indigo-400 font-mono text-sm">EXPERIÊNCIA MILITAR</span>
                   </div>
                   <p className="text-slate-400 leading-relaxed">
                     Atuei como Chefe da Seção de Logística, Oficial de Prevenção de Incêndio e Subcomandante. 
                     Desenvolvi habilidades cruciais de gestão de crises, planejamento estratégico, liderança sob pressão e operações complexas.
                   </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
              <div className="md:flex items-start gap-6 group">
                <div className="hidden md:flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-1 hover:border-indigo-500/30 transition-colors">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Formação Contínua</h3>
                      <span className="text-indigo-400 font-mono text-sm">ACADÊMICO</span>
                   </div>
                   <p className="text-slate-400 leading-relaxed">
                     Graduado em Análise e Desenvolvimento de Sistemas. Atualmente cursando MBA em Inteligência Artificial e Gestão de Negócios, buscando alinhar as mais recentes inovações tecnológicas com estratégias corporativas eficazes.
                   </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <a href="#" className="inline-block text-slate-400 hover:text-white border-b border-dashed border-slate-500 hover:border-white transition-colors pb-1">
               Baixar CV Completo (PDF)
             </a>
          </div>
        </div>
      </section>

      {/* 3. COMPETÊNCIAS */}
      <section id="skills" className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Minhas Competências</h2>
            <p className="text-slate-400">Onde posso agregar valor ao seu projeto</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.competencies.map((comp) => {
              const colors = getColorClasses(comp.colorTheme);
              return (
                <div key={comp.id} className="p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 ${colors.iconBg} ${colors.iconText} rounded-xl flex items-center justify-center text-xl mb-6`}>
                    <i className={comp.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{comp.title}</h3>
                  {comp.subtitle && <p className="text-sm text-slate-400 mb-6 italic border-l-2 border-slate-600 pl-3">{comp.subtitle}</p>}
                  <ul className="space-y-3 text-slate-400">
                    {comp.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <i className={`fas fa-check ${colors.check} text-xs`}></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO CAROUSEL */}
      <section id="portfolio" className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Projetos em Destaque</h2>
              <div className="w-20 h-1 bg-indigo-600 rounded-full"></div>
            </div>
            {/* Desktop Arrows Placeholder */}
            <div className="hidden md:flex gap-2">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-colors"><i className="fas fa-chevron-left"></i></button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-colors"><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
             <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

            {projects.map((project) => (
              <div 
                key={project.id} 
                className="min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20"
              >
                <div className="h-48 bg-slate-700 relative overflow-hidden flex items-center justify-center">
                   {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                        <i className="fas fa-code-branch text-5xl text-slate-600 group-hover:text-indigo-500 transition-colors transform group-hover:scale-110 duration-500"></i>
                     </>
                   )}
                   {project.role && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-slate-900/90 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm shadow-lg">
                           <i className="fas fa-user-tag mr-1.5"></i> {project.role}
                        </span>
                      </div>
                   )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.split(',').map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-700">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors text-center">
                        <i className="fab fa-github mr-2"></i> GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors text-center">
                        <i className="fas fa-external-link-alt mr-2"></i> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES GRID */}
      <section id="services" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Serviços</h2>
            <p className="text-slate-400">Como posso ajudar sua empresa ou projeto</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service) => (
              <div 
                key={service.id} 
                className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all hover:-translate-y-1 group flex flex-col"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-400 text-xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <a 
               href={`https://wa.me/${content.whatsappNumber}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30"
             >
                <i className="fab fa-whatsapp text-lg"></i>
                Solicitar Orçamento
             </a>
          </div>
        </div>
      </section>

      {/* 6. CONTACT / CTA - REDESIGNED */}
      <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col gap-16">
          
          {/* 1. CENTRALIZED IDEA CARD (HIGHLIGHT) */}
          <div id="start-project" className="w-full bg-gradient-to-r from-indigo-900 to-slate-900 p-1 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 duration-700 scroll-mt-24">
             <div className="bg-slate-900 rounded-[1.3rem] p-8 md:p-12 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                 <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-indigo-500/30">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Tem uma ideia de projeto?</h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                      Utilize minha ferramenta inteligente <b>RequirementFlow</b> para estruturar seus requisitos em minutos. É o primeiro passo para transformar sua visão em realidade.
                    </p>
                    <Link 
                      to="/requirements"
                      className="px-8 py-4 bg-white text-indigo-900 font-bold text-lg rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-3"
                    >
                       <i className="fas fa-pen-nib"></i>
                       Estruturar Minha Ideia Agora
                    </Link>
                 </div>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center mb-4">
             <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Ou se preferir</span>
             <i className="fas fa-chevron-down text-slate-600 mt-2 animate-bounce"></i>
          </div>

          {/* 2. CONTACT GRID: INFO + FORM */}
          <div id="contact-channels" className="grid md:grid-cols-2 gap-12 items-start scroll-mt-24">
             
             {/* LEFT: DIRECT CONTACT INFO */}
             <div className="flex flex-col justify-center h-full">
                <h3 className="text-2xl font-bold text-white mb-8">Canais de Contato</h3>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-slate-700 shrink-0">
                       <i className="fas fa-envelope"></i>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">E-mail</span>
                        <a href="mailto:igormatos.dev@gmail.com" className="text-slate-200 font-medium group-hover:text-white transition-colors text-lg">igormatos.dev@gmail.com</a>
                     </div>
                   </div>

                   <a href="https://linkedin.com/in/igormatos" target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-slate-700 shrink-0">
                       <i className="fab fa-linkedin-in"></i>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">LinkedIn</span>
                        <span className="text-slate-200 font-medium group-hover:text-white transition-colors text-lg">/in/igormatos</span>
                     </div>
                   </a>

                   <a href={`https://wa.me/${content.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors border border-slate-700 shrink-0">
                       <i className="fab fa-whatsapp"></i>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">WhatsApp</span>
                        <span className="text-slate-200 font-medium group-hover:text-white transition-colors text-lg">Falar agora</span>
                     </div>
                   </a>
                </div>
             </div>

             {/* RIGHT: CONTACT FORM (PRIORITIZED) */}
             <div className="bg-white rounded-3xl p-8 shadow-2xl relative">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Envie uma mensagem</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                     <input type="text" className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all placeholder:text-slate-400 font-medium text-slate-900" placeholder="Seu nome" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
                     <input type="email" className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all placeholder:text-slate-400 font-medium text-slate-900" placeholder="seu@email.com" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mensagem</label>
                     <textarea rows={4} className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all placeholder:text-slate-400 font-medium text-slate-900 resize-none" placeholder="Como posso ajudar?"></textarea>
                   </div>
                   <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                     <i className="fab fa-whatsapp text-lg"></i> Enviar Mensagem
                   </button>
                </form>
             </div>

          </div>
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
