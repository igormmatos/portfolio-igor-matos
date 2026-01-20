
import { FormSubmission, ProjectStatus, PortfolioProject, SiteContent } from '../types';

const STORAGE_KEY = 'requirement_flow_submissions';
const AUTH_KEY = 'requirement_flow_auth';
const PORTFOLIO_KEY = 'igor_portfolio_projects';
const CONTENT_KEY = 'igor_site_content';

// Dados iniciais (Seed)
const DEFAULT_CONTENT: SiteContent = {
  profileName: 'Igor Matos',
  profileTitle: 'Estrategista Tech & Gestor de Soluções',
  profileBio: 'Com sólida experiência em Análise e Desenvolvimento de Sistemas, gestão de projetos e liderança estratégica, atuo na arquitetura e entrega de soluções tecnológicas robustas. Minha trajetória combina expertise técnica com visão de negócios e gestão de equipes, forjada em ambientes de alta performance.',
  whatsappNumber: '5595991353797',
  services: [
    { 
      id: '1', 
      title: 'Consultoria em TI', 
      description: 'Transforme seus desafios tecnológicos em oportunidades. Ofereço análise estratégica e recomendações personalizadas para otimizar processos e impulsionar o crescimento do seu negócio.', 
      icon: 'fas fa-chess-knight' 
    },
    { 
      id: '2', 
      title: 'Desenvolvimento de Sistemas', 
      description: 'Desenvolvo sistemas web e mobile sob medida, do planejamento à entrega, para que sua ideia se torne uma solução robusta, escalável e eficiente.', 
      icon: 'fas fa-code' 
    },
    { 
      id: '3', 
      title: 'Arquitetura de Soluções', 
      description: 'Garanta estabilidade e segurança. Design de infraestrutura, bancos de dados e APIs preparados para crescer junto com sua demanda.', 
      icon: 'fas fa-server' 
    },
    { 
      id: '4', 
      title: 'Landing Pages', 
      description: 'Crio Landing Pages de alta performance, com design moderno e focado em conversão, para que você atraia mais leads e vendas para seus produtos ou serviços.', 
      icon: 'fas fa-laptop-code' 
    },
    { 
      id: '5', 
      title: 'Assessoria em Gestão', 
      description: 'Evite atrasos e custos extras. Suporte especializado na condução de projetos de TI, garantindo alinhamento estratégico, qualidade e cumprimento de prazos.', 
      icon: 'fas fa-tasks' 
    }
  ],
  competencies: [
    {
      id: '1',
      title: 'Desenvolvimento & Arquitetura',
      subtitle: 'Construindo a base tecnológica para soluções inovadoras.',
      icon: 'fas fa-layer-group',
      items: ['Análise de Sistemas', 'Arquitetura Backend & DB', 'React, Node.js, TypeScript', 'Infraestrutura & Deploy'],
      colorTheme: 'blue'
    },
    {
      id: '2',
      title: 'Gestão & Liderança',
      subtitle: 'Conduzindo equipes e projetos para o sucesso com estratégia e eficiência.',
      icon: 'fas fa-users-cog',
      items: ['Gestão de Projetos Ágeis', 'Liderança de Equipes', 'Planejamento Estratégico', 'Gestão de Requisitos'],
      colorTheme: 'indigo'
    },
    {
      id: '3',
      title: 'Consultoria & Estratégia',
      subtitle: 'Transformando ideias em planos de ação e resultados tangíveis.',
      icon: 'fas fa-chart-line',
      items: ['Consultoria Técnica', 'Definição de Soluções', 'Análise de Negócios', 'Otimização de Processos'],
      colorTheme: 'cyan'
    }
  ]
};

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    title: 'Marçal Treinos',
    role: 'Fullstack Developer',
    description: 'Sistema completo de gestão de fichas de alunos (Web/Mobile). Features: Login Google, Acesso individual, Progressão de treino e Integração MercadoPago.',
    technologies: 'React, Node.js, Firebase, MercadoPago API',
    githubUrl: 'https://github.com/igormatos',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Gestão Embrapa Gado de Leite',
    role: 'Frontend Lead',
    description: 'Sistema de gestão de tarefas otimizado para o setor lácteo, desenvolvido em parceria com o Colégio Cotemig.',
    technologies: 'Vue.js, .NET Core, SQL Server',
    githubUrl: 'https://github.com/igormatos',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1474&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'RequirementFlow',
    role: 'Creator & Developer',
    description: 'Ferramenta SaaS para estruturação inteligente de requisitos de software, facilitando a ponte entre clientes e devs.',
    technologies: 'React, TypeScript, TailwindCSS',
    githubUrl: 'https://github.com/igormatos/reqflow',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1555421689-492a18d9c3ad?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Arquitetura 2C Sistemas',
    role: 'Solutions Architect',
    description: 'Atuação como PM e Arquiteto na reestruturação de sistemas legados e implementação de novos processos de CI/CD.',
    technologies: 'Docker, AWS, Microservices',
    githubUrl: '',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop'
  }
];

export const storageService = {
  // --- SUBMISSIONS (RequirementFlow) ---
  getSubmissions: (): FormSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parsing submissions:', e);
      return [];
    }
  },

  saveSubmission: (submission: FormSubmission) => {
    const submissions = storageService.getSubmissions();
    submission.status = ProjectStatus.NOT_STARTED;
    submissions.unshift(submission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  },

  updateSubmissionStatus: (id: string, status: ProjectStatus) => {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    }
  },

  deleteSubmission: (id: string) => {
    const submissions = storageService.getSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // --- PORTFOLIO ---
  getProjects: (): PortfolioProject[] => {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) return DEFAULT_PROJECTS;
    
    try {
      // Ensure all projects have the role field if it's missing from old data
      const parsed = JSON.parse(data);
      return parsed.map((p: any) => ({
        ...p,
        role: p.role || 'Developer' // Default role if missing
      }));
    } catch (e) {
      console.error('Error parsing projects:', e);
      return DEFAULT_PROJECTS;
    }
  },

  saveProject: (project: PortfolioProject) => {
    const projects = storageService.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(projects));
  },

  deleteProject: (id: string) => {
    const projects = storageService.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(filtered));
  },

  // --- SITE CONTENT ---
  getSiteContent: (): SiteContent => {
    const data = localStorage.getItem(CONTENT_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Merge with default to ensure new fields (like competencies subtitles) exist for old data
        const mergedContent = { 
          ...DEFAULT_CONTENT, 
          ...parsed,
          competencies: parsed.competencies ? parsed.competencies.map((c: any, i: number) => ({
               ...DEFAULT_CONTENT.competencies[i], // fallback to default structure
               ...c,
               items: c.items || DEFAULT_CONTENT.competencies[i]?.items || [] // ensure items is an array
          })) : DEFAULT_CONTENT.competencies
        };
        return mergedContent;
      } catch (e) {
         console.error('Error parsing site content:', e);
         return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  },

  saveSiteContent: (content: SiteContent) => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  },

  // --- AUTH ---
  isAdminLoggedIn: (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  loginAdmin: (password: string): boolean => {
    if (password === 'admin123') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logoutAdmin: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
