
import { FormSubmission, ProjectStatus, PortfolioProject, SiteContent } from '../types';

const STORAGE_KEY = 'requirement_flow_submissions';
const AUTH_KEY = 'requirement_flow_auth';
const PORTFOLIO_KEY = 'igor_portfolio_projects';
const CONTENT_KEY = 'igor_site_content';

// Dados iniciais (Seed)
const DEFAULT_CONTENT: SiteContent = {
  profileName: 'Igor Matos',
  profileTitle: 'Full Stack Developer & Tech Consultant',
  profileBio: 'Especialista em transformar ideias complexas em soluções digitais robustas. Com foco em React, Node.js e arquitetura de software, ajudo empresas e empreendedores a tirarem seus projetos do papel com código limpo e escalável.',
  whatsappNumber: '5595991353797',
  services: [
    { id: '1', title: 'Desenvolvimento Web', description: 'Sites e aplicações web modernas, rápidas e responsivas.', icon: 'fas fa-laptop-code' },
    { id: '2', title: 'Consultoria Técnica', description: 'Análise de viabilidade e arquitetura de sistemas.', icon: 'fas fa-comments' },
    { id: '3', title: 'Mobile Apps', description: 'Soluções nativas ou híbridas para iOS e Android.', icon: 'fas fa-mobile-alt' }
  ]
};

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    title: 'RequirementFlow',
    description: 'Sistema inteligente para coleta e estruturação de requisitos de software, facilitando a comunicação entre PMs e clientes.',
    technologies: 'React, TypeScript, TailwindCSS',
    githubUrl: 'https://github.com/igormatos/reqflow',
    liveUrl: '#'
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Painel administrativo completo para gestão de vendas, estoque e métricas financeiras.',
    technologies: 'Vue.js, Node.js, PostgreSQL',
    githubUrl: 'https://github.com/igormatos/dashboard',
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
    return data ? JSON.parse(data) : DEFAULT_CONTENT;
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