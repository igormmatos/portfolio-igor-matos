import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { ProfileInfo, PortfolioProject, ServiceItem, CompetencyItem, JourneyItem } from '../types';
import { getOptimizedImageUrl } from '../utils/image';
import ScrollReveal from './ScrollReveal';

const LandingPageImproved: React.FC = () => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);
  
  // Estado para o formulário de contato
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Controle de carregamento individual para UX progressiva
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Carrega o perfil primeiro para renderizar o Hero (Largest Contentful Paint)
      try {
        const prof = await storageService.getProfileInfo();
        setProfile(prof);
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoadingProfile(false);
      }

      // Carrega o restante em paralelo sem bloquear a UI inicial
      try {
        const [projs, svcs, comps, journ] = await Promise.all([
          storageService.getProjects(),
          storageService.getServices(),
          storageService.getCompetencies(),
          storageService.getJourney()
        ]);
        setProjects(projs);
        setServices(svcs);
        setCompetencies(comps);
        setJourney(journ);
      } catch (error) {
        console.error("Erro ao carregar dados secundários", error);
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.whatsapp) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const message = `Olá! Meu nome é *${contactForm.name}* (${contactForm.email}).\n\n${contactForm.message}`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${profile.whatsapp}?text=${encodedMessage}`;
      
      window.open(url, '_blank');
      setIsSubmitting(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 500);
  };

  const getColorClasses = (theme: string) => {
    switch(theme) {
      case 'blue': return { iconBg: 'bg-blue-900/30', iconText: 'text-blue-400', check: 'text-blue-500' };
      case 'cyan': return { iconBg: 'bg-cyan-900/30', iconText: 'text-cyan-400', check: 'text-cyan-500' };
      default: return { iconBg: 'bg-indigo-900/30', iconText: 'text-indigo-400', check: 'text-indigo-500' };
    }
  };

  // Componente Skeleton para o Hero
  const HeroSkeleton = () => (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="h-8 w-64 bg-slate-800 rounded-full mb-8 shimmer"></div>
        <div className="h-12 w-3/4 md:w-1/2 bg-slate-800 rounded-lg mb-6 shimmer"></div>
        <div className="h-8 w-2/3 md:w-1/3 bg-slate-800 rounded-lg mb-10 shimmer"></div>
        <div className="h-1.5 w-24 bg-slate-800 rounded-full mb-10 shimmer"></div>
        <div className="h-4 w-full max-w-2xl bg-slate-800 rounded mb-3 shimmer"></div>
        <div className="h-4 w-5/6 max-w-2xl bg-slate-800 rounded mb-12 shimmer"></div>
        <div className="flex gap-4">
            <div className="h-14 w-40 bg-slate-800 rounded-xl shimmer"></div>
            <div className="h-14 w-40 bg-slate-800 rounded-xl shimmer"></div>
        </div>
    </div>
  );

  return (
    <div className="bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      {/* 1. HERO SECTION - MELHORADO COM ANIMAÇÕES */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 border-b border-slate-800">
        
        {/* Background Layer com Blobs Animados */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-slate-900"></div>
            
            {/* Blobs decorativos animados */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 blob"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-600 blob" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600 blob" style={{animationDelay: '4s'}}></div>
            
            {/* Gradiente overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center pt-44 pb-16 md:py-0">
            
            {loadingProfile ? (
                <HeroSkeleton />
            ) : profile ? (
                <>
                    {/* Badge com animação */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 mb-8">
                    <span className="inline-flex items-center py-2 px-5 rounded-full glass-morphism text-green-400 text-xs font-bold uppercase tracking-wider shadow-lg hover-scale">
                        <span className="relative flex h-2.5 w-2.5 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        Disponível para novos projetos
                    </span>
                    </div>

                    {/* Main Text com gradiente animado */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-tight text-white drop-shadow-xl text-shadow-lg pb-2">
                        Olá, eu sou {profile.displayName}
                    </h1>
                    <h2 className="text-2xl md:text-5xl font-extrabold mb-8 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient drop-shadow-sm pb-2">
                        {profile.headline}
                    </h2>
                    
                    <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full mx-auto mb-8 shadow-lg shadow-indigo-500/50 animate-pulse-soft"></div>

                    <h3 className="text-lg md:text-2xl text-slate-100 font-light mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        Transformando desafios em resultados com tecnologia e liderança.
                    </h3>
                    
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-light drop-shadow">
                        {profile.bio}
                    </p>
                    </div>

                    {/* Buttons com glow effect */}
                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <a href="https://www.linkedin.com/in/igor-mmatos/" target="_blank" rel="noopener noreferrer" 
                        className="px-8 py-4 glass-morphism hover:bg-slate-700/50 text-white font-bold rounded-xl border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-3 group shadow-lg hover-scale">
                        <i className="fab fa-linkedin text-xl group-hover:scale-110 transition-transform"></i> 
                        <span>Ver Perfil Profissional</span>
                    </a>
                    <a href="#services" onClick={(e) => scrollToSection(e, 'services')} 
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl glow-effect transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                        <span>Contratar Serviços</span>
                        <i className="fas fa-arrow-right"></i>
                    </a>
                    </div>
                </>
            ) : (
                <div className="text-center text-red-400">Erro ao carregar perfil.</div>
            )}

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block opacity-50 hover:opacity-100 transition-opacity">
           <a href="#journey" onClick={(e) => scrollToSection(e, 'journey')} className="text-slate-400 hover:text-white">
              <i className="fas fa-chevron-down text-2xl"></i>
           </a>
        </div>
      </section>

      {/* 2. JORNADA COM SCROLL REVEAL */}
      <section id="journey" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Blob decorativo de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blob"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Minha Jornada</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
              <p className="mt-4 text-slate-300 text-lg">Tecnologia, Liderança e Resultados</p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Coluna Esquerda: Jornada */}
              <div className="lg:col-span-8 space-y-12">
                {journey.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 100}>
                    <div className="relative pl-8 md:pl-0 border-l-2 border-slate-800 md:border-none">
                      <div className="md:flex items-start gap-6 group">
                        <div className="hidden md:flex flex-col items-center">
                          <div className="w-14 h-14 rounded-full glass-morphism border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 hover-scale">
                            <i className={`fas ${item.type === 'education' ? 'fa-graduation-cap' : 'fa-briefcase'} text-xl`}></i>
                          </div>
                          <div className="h-full w-0.5 bg-gradient-to-b from-slate-700 to-transparent my-2"></div>
                        </div>
                        <div className="flex-1 glass-morphism p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 hover-3d">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-white">{item.title}</h3>
                              <div className="text-right">
                                <span className="text-indigo-400 font-mono text-sm block uppercase font-bold">{item.company}</span>
                                {item.period && <span className="text-slate-500 text-xs">{item.period}</span>}
                              </div>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                
                {journey.length === 0 && <div className="text-center text-slate-500">
                    <div className="space-y-8">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-32 bg-slate-800 rounded-2xl shimmer"></div>
                        ))}
                    </div>
                </div>}

                <ScrollReveal>
                  <div className="mt-12 text-center lg:text-left">
                      <a href="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/src/CV-Igor-MATOS.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-300 hover:text-white border-b-2 border-dashed border-slate-500 hover:border-indigo-400 transition-colors pb-1">
                        <i className="fas fa-download"></i>
                        Baixar CV Completo (PDF)
                      </a>
                  </div>
                </ScrollReveal>
              </div>

              {/* Coluna Direita: Imagem do Profissional */}
              <div className="hidden lg:block lg:col-span-4 mt-12 lg:mt-0 order-last lg:order-none">
                  <ScrollReveal direction="left">
                    <div className="lg:sticky lg:top-32">
                        <div className="gradient-border animate-pulse-soft">
                          <div className="gradient-border-content relative rounded-3xl overflow-hidden shadow-2xl">
                              {/* Elementos decorativos de fundo */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                              
                              <img 
                                src={getOptimizedImageUrl("https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/Matos_sem_fundo.png", 600)}
                                alt="Igor Matos Profissional" 
                                loading="eager"
                                fetchPriority="high"
                                className="w-full h-auto object-cover relative z-10 hover:scale-105 transition-transform duration-700"
                              />
                              
                              {/* Gradiente na base da imagem */}
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent z-20"></div>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm italic">"Compromisso com a excelência técnica e resultados reais."</p>
                        </div>
                    </div>
                  </ScrollReveal>
              </div>
          </div>
        </div>
      </section>

      {/* 3. COMPETÊNCIAS COM ANIMAÇÕES */}
      <section id="skills" className="py-24 bg-slate-900/50 border-y border-slate-800 relative overflow-hidden">
        {/* Blob decorativo */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 blob"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Minhas Competências</h2>
              <p className="text-slate-300">Onde posso agregar valor ao seu projeto</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {competencies.map((comp, index) => {
              const colors = getColorClasses(comp.colorTheme);
              return (
                <ScrollReveal key={comp.id} delay={index * 150} direction="up">
                  <div className="p-8 rounded-3xl glass-morphism border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 hover-3d group">
                    <div className={`w-14 h-14 ${colors.iconBg} ${colors.iconText} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={comp.icon}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{comp.title}</h3>
                    {comp.subtitle && <p className="text-sm text-slate-400 mb-6 italic border-l-2 border-indigo-500 pl-3">{comp.subtitle}</p>}
                    <ul className="space-y-3 text-slate-300">
                      {comp.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 group/item">
                          <i className={`fas fa-check ${colors.check} text-xs group-hover/item:scale-125 transition-transform`}></i> 
                          <span className="group-hover/item:text-white transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO CAROUSEL MELHORADO */}
      <section id="portfolio" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Blob decorativo */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/10 blob"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Projetos em Destaque</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full glass-morphism border border-slate-600 hover:border-indigo-500 hover:bg-slate-700 flex items-center justify-center transition-all hover-scale">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full glass-morphism border border-slate-600 hover:border-indigo-500 hover:bg-slate-700 flex items-center justify-center transition-all hover-scale">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </ScrollReveal>

          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {projects.length > 0 ? projects.map((project) => (
              <div key={project.id} className="min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center flex flex-col glass-morphism rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20">
                <div className="h-48 bg-slate-700 relative overflow-hidden flex items-center justify-center">
                   {project.imageUrl ? (
                      <>
                        <img src={getOptimizedImageUrl(project.imageUrl, 400)} loading="lazy" alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {/* Overlay com informações ao hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-medium">Ver detalhes →</p>
                        </div>
                      </>
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                       <i className="fas fa-code-branch text-5xl text-slate-600 group-hover:text-indigo-500 transition-colors transform group-hover:scale-110 duration-500"></i>
                     </>
                   )}
                   {project.role && (
                     <div className="absolute top-4 left-4">
                       <span className="glass-morphism text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700/50 shadow-lg">
                         <i className="fas fa-user-tag mr-1.5"></i> {project.role}
                       </span>
                     </div>
                   )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.split(',').map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-900/50 text-slate-300 rounded border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 transition-colors">{tech.trim()}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg glass-morphism hover:bg-slate-600 text-white text-sm font-medium transition-all text-center hover-scale">
                        <i className="fab fa-github mr-2"></i> GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all text-center hover-scale">
                        <i className="fas fa-external-link-alt mr-2"></i> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )) : (
                [1,2,3].map(i => (
                    <div key={i} className="min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                        <div className="h-48 bg-slate-700 shimmer"></div>
                        <div className="p-6 space-y-3">
                            <div className="h-6 bg-slate-700 rounded w-3/4 shimmer"></div>
                            <div className="h-4 bg-slate-700 rounded w-full shimmer"></div>
                            <div className="h-4 bg-slate-700 rounded w-2/3 shimmer"></div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* 5. SERVICES GRID MELHORADO */}
      <section id="services" className="py-24 bg-slate-900/50 border-t border-slate-800 relative overflow-hidden">
        {/* Blob decorativo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 blob"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Serviços</h2>
              <p className="text-slate-300">Como posso ajudar sua empresa ou projeto</p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 100} direction="up">
                <div className="glass-morphism p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all hover:-translate-y-2 group flex flex-col hover-3d">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-indigo-400 text-2xl mb-6 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shrink-0 hover-scale">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed flex-grow">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="mt-16 text-center">
               <a 
                  href={profile?.whatsapp ? `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá, vi o seu site e gostaria de conversar um pouco mais sobre os serviços!")}` : "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/30 glow-effect hover-scale text-lg"
               >
                  <i className="fab fa-whatsapp text-2xl"></i> Solicitar Orçamento
               </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. CONTACT MELHORADO COM FORMULÁRIO DARK */}
      <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 blob" style={{animationDelay: '3s'}}></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col gap-16">
          
          <div id="contact-channels" className="grid md:grid-cols-2 gap-12 items-start scroll-mt-24">
             <ScrollReveal direction="right">
               <div className="flex flex-col justify-center h-full space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Canais de Contato</h3>
                  
                  <div className="flex items-center gap-4 group p-4 rounded-xl glass-morphism hover:bg-slate-800/50 transition-all border border-transparent hover:border-indigo-500/50 hover-scale">
                       <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white border border-slate-700 shrink-0 transition-all">
                         <i className="fas fa-envelope"></i>
                       </div>
                       <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase">Email</span>
                         <span className="text-slate-200 font-medium group-hover:text-white text-lg transition-colors">{profile?.email || 'contato@exemplo.com'}</span>
                       </div>
                  </div>
                  
                  <a href={profile?.linkedinUrl || "https://www.linkedin.com/in/igor-mmatos/"} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl glass-morphism hover:bg-slate-800/50 transition-all border border-transparent hover:border-indigo-500/50 hover-scale">
                       <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white border border-slate-700 shrink-0 transition-all">
                         <i className="fab fa-linkedin-in"></i>
                       </div>
                       <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase">LinkedIn</span>
                         <span className="text-slate-200 font-medium group-hover:text-white text-lg transition-colors">Ver Perfil</span>
                       </div>
                  </a>
                  
                  <a href={profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : "#"} target="_blank" rel="noreferrer" className="flex items-center gap-4 group p-4 rounded-xl glass-morphism hover:bg-slate-800/50 transition-all border border-transparent hover:border-green-500/50 hover-scale">
                       <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-green-400 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white border border-slate-700 shrink-0 transition-all">
                         <i className="fab fa-whatsapp"></i>
                       </div>
                       <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase">WhatsApp</span>
                         <span className="text-slate-200 font-medium group-hover:text-white text-lg transition-colors">Falar agora</span>
                       </div>
                  </a>
               </div>
             </ScrollReveal>
             
             <ScrollReveal direction="left">
               <div className="glass-morphism rounded-3xl p-8 shadow-2xl relative border border-slate-700 hover:border-indigo-500/50 transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-white">Envie uma mensagem</h3>
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-100 placeholder-slate-500" 
                          placeholder="Seu nome" 
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
                        <input 
                          type="email"
                          required 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-100 placeholder-slate-500" 
                          placeholder="seu@email.com" 
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mensagem</label>
                        <textarea 
                          rows={4}
                          required 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-100 placeholder-slate-500 resize-none" 
                          placeholder="Como posso ajudar?"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        ></textarea>
                     </div>
                     <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center gap-2 glow-effect hover-scale disabled:cursor-not-allowed"
                     >
                       {isSubmitting ? (
                         <>
                           <i className="fas fa-circle-notch fa-spin text-lg"></i>
                           <span>Enviando...</span>
                         </>
                       ) : (
                         <>
                           <i className="fab fa-whatsapp text-lg"></i>
                           <span>Enviar Mensagem</span>
                         </>
                       )}
                     </button>
                  </form>
               </div>
             </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      {profile?.whatsapp && (
        <a 
          href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá, vi o seu site e gostaria de conversar um pouco mais!")}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all hover:scale-110 animate-bounce-slow glow-effect" 
          aria-label="Contato via WhatsApp"
        >
            <i className="fab fa-whatsapp text-3xl"></i>
        </a>
      )}
    </div>
  );
};

export default LandingPageImproved;
