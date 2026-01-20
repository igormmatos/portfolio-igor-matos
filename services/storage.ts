
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
      description: 'Análise de necessidades, recomendação de tecnologias e otimização de processos para escalar seu negócio.', 
      icon: 'fas fa-chess-knight' 
    },
    { 
      id: '2', 
      title: 'Desenvolvimento de Sistemas', 
      description: 'Criação de soluções personalizadas do conceito à implementação, para web e mobile.', 
      icon: 'fas fa-code' 
    },
    { 
      id: '3', 
      title: 'Arquitetura de Soluções', 
      description: 'Design de sistemas robustos, escaláveis e seguros (Backend, DB Design e Infraestrutura).', 
      icon: 'fas fa-server' 
    },
    { 
      id: '4', 
      title: 'Landing Pages', 
      description: 'Páginas de alta conversão para produtos, serviços ou eventos, com design moderno.', 
      icon: 'fas fa-laptop-code' 
    },
    { 
      id: '5', 
      title: 'Assessoria em Gestão', 
      description: 'Suporte na condução de projetos de TI, garantindo prazos, qualidade e alinhamento estratégico.', 
      icon: 'fas fa-tasks' 
    }
  ],
  competencies: [
    {
      id: '1',
      title: 'Desenvolvimento & Arquitetura',
      icon: 'fas fa-layer-group',
      items: ['Análise de Sistemas', 'Arquitetura Backend & DB', 'React, Node.js, TypeScript', 'Infraestrutura & Deploy'],
      colorTheme: 'blue'
    },
    {
      id: '2',
      title: 'Gestão & Liderança',
      icon: 'fas fa-users-cog',
      items: ['Gestão de Projetos Ágeis', 'Liderança de Equipes', 'Planejamento Estratégico', 'Gestão de Requisitos'],
      colorTheme: 'indigo'
    },
    {
      id: '3',
      title: 'Consultoria & Estratégia',
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
    description: 'Sistema completo de gestão de fichas de alunos (Web/Mobile). Features: Login Google, Acesso individual, Progressão de treino e Integração MercadoPago.',
    technologies: 'React, Node.js, Firebase, MercadoPago API',
    githubUrl: 'https://github.com/igormatos',
    liveUrl: '#'
  },
  {
    id: '2',
    title: 'Gestão Embrapa Gado de Leite',
    description: 'Sistema de gestão de tarefas otimizado para o setor lácteo, desenvolvido em parceria com o Colégio Cotemig.',
    technologies: 'Vue.js, .NET Core, SQL Server',
    githubUrl: 'https://github.com/igormatos',
    liveUrl: '#'
  },
  {
    id: '3',
    title: 'RequirementFlow',
    description: 'Ferramenta SaaS para estruturação inteligente de requisitos de software, facilitando a ponte entre clientes e devs.',
    technologies: 'React, TypeScript, TailwindCSS',
    githubUrl: 'https://github.com/igormatos/reqflow',
    liveUrl: '#'
  },
  {
    id: '4',
    title: 'Arquitetura 2C Sistemas',
    description: 'Atuação como PM e Arquiteto na reestruturação de sistemas legados e implementação de novos processos de CI/CD.',
    technologies: 'Docker, AWS, Microservices',
    githubUrl: '',
    liveUrl: '#'
  }
];

export const storageService = {
  // --- SUBMISSIONS (RequirementFlow) ---
  getSubmissions: (): FormSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
    return data ? JSON.parse(data) : DEFAULT_PROJECTS;
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
      const parsed = JSON.parse(data);
      // Merge with default to ensure new fields (like competencies) exist for old data
      return { 
        ...DEFAULT_CONTENT, 
        ...parsed, 
        competencies: parsed.competencies || DEFAULT_CONTENT.competencies 
      };
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
