
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { ProfileInfo, PortfolioProject, ServiceItem, CompetencyItem, JourneyItem } from '../types';

const LandingPage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prof, projs, svcs, comps, journ] = await Promise.all([
          storageService.getProfileInfo(),
          storageService.getProjects(),
          storageService.getServices(),
          storageService.getCompetencies(),
          storageService.getJourney()
        ]);
        setProfile(prof);
        setProjects(projs);
        setServices(svcs);
        setCompetencies(comps);
        setJourney(journ);
      } catch (error) {
        console.error("Failed to load landing page data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;
  if (!profile) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Erro ao carregar conteúdo.</div>;

  return (
    <div className="bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto px-4 w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-in slide-in-from-left-8 duration-700 fade-in">
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-sm text-green-400 text-xs font-bold uppercase tracking-wider mb-8">
              <i className="fas fa-circle text-[8px] mr-2 align-middle"></i> Disponível para novos projetos
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight leading-tight text-white">
              Olá, eu sou {profile.displayName}
            </h1>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {profile.headline}
            </h2>
             <h2 className="text-xl md:text-2xl text-slate-300 font-light mb-6">
              Transformando desafios em resultados com tecnologia e liderança.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-lg">
              {profile.bio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.linkedin.com/in/igor-mmatos/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 text-center flex items-center justify-center gap-2">
                <i className="fab fa-linkedin text-lg"></i> Ver Perfil Profissional
              </a>
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 text-center">
                Contratar Serviços
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center items-center animate-in slide-in-from-right-8 duration-700 fade-in">
            <div className="relative w-full max-w-[350px] md:max-w-[420px]">
              {/* Glow effect behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/20 rounded-full blur-[60px] -z-10"></div>
              
              {/* Card Container */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-slate-800/40 backdrop-blur-sm shadow-2xl">
                 {/* Background Gradient inside card */}
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-60"></div>
                 
                 <img 
                    src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/sign/media/Matos_sem_fundo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNzRiZDg2NS01Y2MxLTQ2ZGUtYjUyOC1iMGY4ZDBhMjNiMzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9NYXRvc19zZW1fZnVuZG8ucG5nIiwiaWF0IjoxNzY4OTM3ODE4LCJleHAiOjE4MDA0NzM4MTh9.7--4FYCbQH_hA0mrCnDqLkkdMiSimiu2Ya61fFfnSdk" 
                    alt="Profile" 
                    className="w-full h-auto object-cover relative z-10 transform hover:scale-105 transition-transform duration-700"
                 />
                 
                 {/* Bottom Fade to blend torso */}
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JORNADA (Dynamic from DB) */}
      <section id="journey" className="py-24 bg-slate-900 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Minha Jornada</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-400 text-lg">Tecnologia, Liderança e Resultados</p>
          </div>

          <div className="space-y-12">
            {journey.map((item) => (
              <div key={item.id} className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
                <div className="md:flex items-start gap-6 group">
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className={`fas ${item.type === 'education' ? 'fa-graduation-cap' : 'fa-briefcase'}`}></i>
                    </div>
                    <div className="h-full w-0.5 bg-slate-800 my-2"></div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-1 hover:border-indigo-500/30 transition-colors">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <div className="text-right">
                           <span className="text-indigo-400 font-mono text-sm block uppercase">{item.company}</span>
                           {item.period && <span className="text-slate-500 text-xs">{item.period}</span>}
                        </div>
                     </div>
                     <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {journey.length === 0 && <div className="text-center text-slate-500">Nenhuma informação de jornada cadastrada.</div>}
          </div>
          
          <div className="mt-12 text-center">
             <a href="#" className="inline-block text-slate-400 hover:text-white border-b border-dashed border-slate-500 hover:border-white transition-colors pb-1">Baixar CV Completo (PDF)</a>
          </div>
        </div>
      </section>

      {/* 3. COMPETÊNCIAS (Dynamic from DB) */}
      <section id="skills" className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Minhas Competências</h2>
            <p className="text-slate-400">Onde posso agregar valor ao seu projeto</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {competencies.map((comp) => {
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

      {/* 4. PORTFOLIO CAROUSEL (Dynamic) */}
      <section id="portfolio" className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Projetos em Destaque</h2>
              <div className="w-20 h-1 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-colors"><i className="fas fa-chevron-left"></i></button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-colors"><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {projects.map((project) => (
              <div key={project.id} className="min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20">
                <div className="h-48 bg-slate-700 relative overflow-hidden flex items-center justify-center">
                   {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <><div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div><i className="fas fa-code-branch text-5xl text-slate-600 group-hover:text-indigo-500 transition-colors transform group-hover:scale-110 duration-500"></i></>
                   )}
                   {project.role && <div className="absolute top-4 left-4"><span className="bg-slate-900/90 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm shadow-lg"><i className="fas fa-user-tag mr-1.5"></i> {project.role}</span></div>}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.split(',').map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-700">{tech.trim()}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors text-center"><i className="fab fa-github mr-2"></i> GitHub</a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors text-center"><i className="fas fa-external-link-alt mr-2"></i> Demo</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES GRID (Dynamic) */}
      <section id="services" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Serviços</h2>
            <p className="text-slate-400">Como posso ajudar sua empresa ou projeto</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all hover:-translate-y-1 group flex flex-col">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-400 text-xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
             <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30">
                <i className="fab fa-whatsapp text-lg"></i> Solicitar Orçamento
             </a>
          </div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col gap-16">
          
          <div id="start-project" className="w-full bg-gradient-to-r from-indigo-900 to-slate-900 p-1 rounded-3xl shadow-2xl scroll-mt-24">
             <div className="bg-slate-900 rounded-[1.3rem] p-8 md:p-12 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-indigo-500/30"><i className="fas fa-lightbulb"></i></div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Tem uma ideia de projeto?</h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">Utilize minha ferramenta inteligente <b>RequirementFlow</b> para estruturar seus requisitos em minutos.</p>
                    <Link to="/requirements" className="px-8 py-4 bg-white text-indigo-900 font-bold text-lg rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-3"><i className="fas fa-pen-nib"></i> Estruturar Minha Ideia Agora</Link>
                 </div>
             </div>
          </div>

          <div id="contact-channels" className="grid md:grid-cols-2 gap-12 items-start scroll-mt-24">
             <div className="flex flex-col justify-center h-full space-y-6">
                <h3 className="text-2xl font-bold text-white mb-2">Canais de Contato</h3>
                <div className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white border border-slate-700 shrink-0"><i className="fas fa-envelope"></i></div>
                     <div><span className="block text-xs font-bold text-slate-500 uppercase">E-mail</span><a href={`mailto:${profile.email}`} className="text-slate-200 font-medium group-hover:text-white text-lg">{profile.email}</a></div>
                </div>
                <a href={profile.linkedinUrl || "https://www.linkedin.com/in/igor-mmatos/"} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white border border-slate-700 shrink-0"><i className="fab fa-linkedin-in"></i></div>
                     <div><span className="block text-xs font-bold text-slate-500 uppercase">LinkedIn</span><span className="text-slate-200 font-medium group-hover:text-white text-lg">Ver Perfil</span></div>
                </a>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-green-400 group-hover:bg-green-600 group-hover:text-white border border-slate-700 shrink-0"><i className="fab fa-whatsapp"></i></div>
                     <div><span className="block text-xs font-bold text-slate-500 uppercase">WhatsApp</span><span className="text-slate-200 font-medium group-hover:text-white text-lg">Falar agora</span></div>
                </a>
             </div>
             <div className="bg-white rounded-3xl p-8 shadow-2xl relative">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Envie uma mensagem</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label><input type="text" className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="Seu nome" /></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label><input type="email" className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="seu@email.com" /></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mensagem</label><textarea rows={4} className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-slate-900 resize-none" placeholder="Como posso ajudar?"></textarea></div>
                   <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center gap-2"><i className="fab fa-whatsapp text-lg"></i> Enviar Mensagem</button>
                </form>
             </div>
          </div>
        </div>
      </section>

      <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all hover:scale-110 animate-bounce-slow" aria-label="Contato via WhatsApp">
        <i className="fab fa-whatsapp text-3xl"></i>
      </a>
    </div>
  );
};

export default LandingPage;
