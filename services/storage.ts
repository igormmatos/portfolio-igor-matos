
import { FormSubmission, ProjectStatus, PortfolioProject, ProfileInfo, ServiceItem, CompetencyItem, JourneyItem } from '../types';
import { supabase } from './supabase';

// --- DADOS PADRÃO (FALLBACK / SEED) ---
const DEFAULT_PROFILE: ProfileInfo = {
  displayName: 'Igor Matos',
  headline: 'Estrategista Tech & Gestor de Soluções',
  bio: 'Minha trajetória combina expertise técnica com visão de negócios.',
  whatsapp: '5595991353797',
  email: 'igormatos.dev@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/igor-mmatos/'
};

const DEFAULT_PROJECTS_DATA = [
  {
    title: 'Marçal Treinos',
    role: 'Fullstack Developer',
    description: 'Sistema completo de gestão de fichas de alunos (Web/Mobile). Features: Login Google, Acesso individual, Progressão de treino e Integração MercadoPago.',
    technologies: 'React, Node.js, Firebase, MercadoPago API',
    github_url: 'https://github.com/igormatos',
    live_url: '#',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop'
  },
  {
    title: 'Gestão Embrapa Gado de Leite',
    role: 'Frontend Lead',
    description: 'Sistema de gestão de tarefas otimizado para o setor lácteo, desenvolvido em parceria com o Colégio Cotemig.',
    technologies: 'Vue.js, .NET Core, SQL Server',
    github_url: 'https://github.com/igormatos',
    live_url: '#',
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1474&auto=format&fit=crop'
  },
  {
    title: 'RequirementFlow',
    role: 'Creator & Developer',
    description: 'Ferramenta SaaS para estruturação inteligente de requisitos de software, facilitando a ponte entre clientes e devs.',
    technologies: 'React, TypeScript, TailwindCSS',
    github_url: 'https://github.com/igormatos/reqflow',
    live_url: '#',
    image_url: 'https://images.unsplash.com/photo-1555421689-492a18d9c3ad?q=80&w=1470&auto=format&fit=crop'
  },
  {
    title: 'Arquitetura 2C Sistemas',
    role: 'Solutions Architect',
    description: 'Atuação como PM e Arquiteto na reestruturação de sistemas legados e implementação de novos processos de CI/CD.',
    technologies: 'Docker, AWS, Microservices',
    github_url: '',
    live_url: '#',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop'
  }
];

const DEFAULT_SERVICES_DATA = [
    { 
      title: 'Consultoria em TI', 
      description: 'Transforme seus desafios tecnológicos em oportunidades. Ofereço análise estratégica e recomendações personalizadas para otimizar processos e impulsionar o crescimento do seu negócio.', 
      icon: 'fas fa-chess-knight',
      display_order: 1
    },
    { 
      title: 'Desenvolvimento de Sistemas', 
      description: 'Desenvolvo sistemas web e mobile sob medida, do planejamento à entrega, para que sua ideia se torne uma solução robusta, escalável e eficiente.', 
      icon: 'fas fa-code',
      display_order: 2
    },
    { 
      title: 'Arquitetura de Soluções', 
      description: 'Garanta estabilidade e segurança. Design de infraestrutura, bancos de dados e APIs preparados para crescer junto com sua demanda.', 
      icon: 'fas fa-server',
      display_order: 3
    },
    { 
      title: 'Landing Pages', 
      description: 'Crio Landing Pages de alta performance, com design moderno e focado em conversão, para que você atraia mais leads e vendas para seus produtos ou serviços.', 
      icon: 'fas fa-laptop-code',
      display_order: 4
    },
    { 
      title: 'Assessoria em Gestão', 
      description: 'Evite atrasos e custos extras. Suporte especializado na condução de projetos de TI, garantindo alinhamento estratégico, qualidade e cumprimento de prazos.', 
      icon: 'fas fa-tasks',
      display_order: 5
    }
];

const DEFAULT_COMPETENCIES_DATA = [
    {
      title: 'Desenvolvimento & Arquitetura',
      subtitle: 'Construindo a base tecnológica para soluções inovadoras.',
      icon: 'fas fa-layer-group',
      items: ['Análise de Sistemas', 'Arquitetura Backend & DB', 'React, Node.js, TypeScript', 'Infraestrutura & Deploy'],
      color_theme: 'blue',
      display_order: 1
    },
    {
      title: 'Gestão & Liderança',
      subtitle: 'Conduzindo equipes e projetos para o sucesso com estratégia e eficiência.',
      icon: 'fas fa-users-cog',
      items: ['Gestão de Projetos Ágeis', 'Liderança de Equipes', 'Planejamento Estratégico', 'Gestão de Requisitos'],
      color_theme: 'indigo',
      display_order: 2
    },
    {
      title: 'Consultoria & Estratégia',
      subtitle: 'Transformando ideias em planos de ação e resultados tangíveis.',
      icon: 'fas fa-chart-line',
      items: ['Consultoria Técnica', 'Definição de Soluções', 'Análise de Negócios', 'Otimização de Processos'],
      color_theme: 'cyan',
      display_order: 3
    }
];

const DEFAULT_JOURNEY_DATA = [
    {
        title: 'Project Manager & Arquiteto',
        company: '2C SISTEMAS',
        description: 'Liderei a arquitetura de sistemas complexos, desde o design de banco de dados até o backend e infraestrutura. Atuei na definição de requisitos e na gestão ágil de equipes de desenvolvimento, garantindo entregas robustas e escaláveis.',
        type: 'work',
        display_order: 1
    },
    {
        title: 'Parceria Embrapa & Cotemig',
        company: 'PROJETO DE INOVAÇÃO',
        description: 'Desenvolvimento de sistema de gestão de tarefas voltado para o setor lácteo. O projeto focou na otimização de processos produtivos, unindo tecnologia de ponta com as necessidades do campo.',
        type: 'work',
        display_order: 2
    },
    {
        title: 'Liderança Militar & Logística',
        company: 'EXPERIÊNCIA MILITAR',
        description: 'Atuei como Chefe da Seção de Logística, Oficial de Prevenção de Incêndio e Subcomandante. Desenvolvi habilidades cruciais de gestão de crises, planejamento estratégico, liderança sob pressão e operações complexas.',
        type: 'work',
        display_order: 3
    },
    {
        title: 'Formação Contínua',
        company: 'ACADÊMICO',
        description: 'Graduado em Análise e Desenvolvimento de Sistemas. Atualmente cursando MBA em Inteligência Artificial e Gestão de Negócios, buscando alinhar as mais recentes inovações tecnológicas com estratégias corporativas eficazes.',
        type: 'education',
        display_order: 4
    }
];

// Helper to seed data only if authenticated
const seedIfAuthenticated = async (table: string, data: any[]) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
        // Only insert if user is logged in (Admin), respecting RLS
        await supabase.from(table).insert(data);
    }
};

export const storageService = {
  // --- SUBMISSIONS ---
  
  getSubmissions: async (): Promise<FormSubmission[]> => {
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data.map((item: any) => ({
      id: item.id,
      timestamp: item.created_at,
      userName: item.user_name,
      userEmail: item.user_email,
      userPhone: item.user_phone,
      isWhatsApp: item.is_whatsapp,
      status: item.status,
      answers: item.answers
    }));
  },

  saveSubmission: async (submission: FormSubmission) => {
    // This is allowed by "Public Insert Submissions" policy
    const { error } = await supabase.from('submissions').insert({
      user_name: submission.userName,
      user_email: submission.userEmail,
      user_phone: submission.userPhone,
      is_whatsapp: submission.isWhatsApp,
      status: ProjectStatus.NOT_STARTED,
      answers: submission.answers,
    });
    if (error) throw error;
  },

  updateSubmissionStatus: async (id: string, status: ProjectStatus) => {
    const { error } = await supabase.from('submissions').update({ status }).eq('id', id);
    if (error) throw error;
  },

  deleteSubmission: async (id: string) => {
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (error) throw error;
  },

  // --- PORTFOLIO ---

  getProjects: async (): Promise<PortfolioProject[]> => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    // Fallback if empty or error
    if (!error && (!data || data.length === 0)) {
        // Attempt to seed ONLY if authenticated to avoid RLS error
        await seedIfAuthenticated('projects', DEFAULT_PROJECTS_DATA);
        
        // Return defaults immediately for UI consistency
        return DEFAULT_PROJECTS_DATA.map((p: any) => ({
            id: 'temp_' + Math.random(), // Temporary ID since we didn't necessarily save
            title: p.title,
            role: p.role,
            description: p.description,
            technologies: p.technologies,
            githubUrl: p.github_url,
            liveUrl: p.live_url,
            imageUrl: p.image_url
        }));
    }

    if (error || !data) return [];
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      role: p.role,
      description: p.description,
      technologies: p.technologies,
      githubUrl: p.github_url,
      liveUrl: p.live_url,
      imageUrl: p.image_url
    }));
  },

  saveProject: async (project: PortfolioProject) => {
    const dbProject = {
      title: project.title,
      role: project.role,
      description: project.description,
      technologies: project.technologies,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      image_url: project.imageUrl
    };
    let result;
    if (project.id && project.id.length > 15 && !project.id.startsWith('temp_')) { 
      result = await supabase.from('projects').update(dbProject).eq('id', project.id);
    } else {
      result = await supabase.from('projects').insert(dbProject);
    }
    if (result.error) throw result.error;
  },

  deleteProject: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // --- PROFILE INFO (Singleton) ---

  getProfileInfo: async (): Promise<ProfileInfo> => {
    const { data, error } = await supabase.from('profile_info').select('*').limit(1);
    
    // If empty, return default
    if (!error && (!data || data.length === 0)) {
        // Seed only if authenticated
        const dbData = {
          display_name: DEFAULT_PROFILE.displayName,
          headline: DEFAULT_PROFILE.headline,
          bio: DEFAULT_PROFILE.bio,
          whatsapp: DEFAULT_PROFILE.whatsapp,
          email_contact: DEFAULT_PROFILE.email,
          linkedin_url: DEFAULT_PROFILE.linkedinUrl,
          updated_at: new Date().toISOString()
        };
        await seedIfAuthenticated('profile_info', [dbData]);
        return DEFAULT_PROFILE;
    }

    if (error || !data || data.length === 0) return DEFAULT_PROFILE;
    
    const row = data[0];
    return {
      id: row.id,
      displayName: row.display_name,
      headline: row.headline,
      bio: row.bio,
      whatsapp: row.whatsapp,
      email: row.email_contact,
      linkedinUrl: row.linkedin_url
    };
  },

  saveProfileInfo: async (info: ProfileInfo) => {
    const dbData = {
      display_name: info.displayName,
      headline: info.headline,
      bio: info.bio,
      whatsapp: info.whatsapp,
      email_contact: info.email,
      linkedin_url: info.linkedinUrl,
      updated_at: new Date().toISOString()
    };
    let result;
    if (info.id) {
      result = await supabase.from('profile_info').update(dbData).eq('id', info.id);
    } else {
      result = await supabase.from('profile_info').insert(dbData);
    }
    if (result.error) throw result.error;
  },

  // --- SERVICES (Normalized) ---

  getServices: async (): Promise<ServiceItem[]> => {
    const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    
    if (!error && (!data || data.length === 0)) {
        await seedIfAuthenticated('services', DEFAULT_SERVICES_DATA);
        return DEFAULT_SERVICES_DATA.map((s: any) => ({
            id: 'temp_' + Math.random(),
            title: s.title,
            description: s.description,
            icon: s.icon,
            displayOrder: s.display_order
        }));
    }

    if (error) return [];
    return data.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
      displayOrder: s.display_order
    }));
  },

  saveService: async (service: ServiceItem) => {
    const dbData = {
      title: service.title,
      description: service.description,
      icon: service.icon,
      display_order: service.displayOrder
    };
    let result;
    if (service.id && service.id.length > 15 && !service.id.startsWith('temp_')) {
      result = await supabase.from('services').update(dbData).eq('id', service.id);
    } else {
      result = await supabase.from('services').insert(dbData);
    }
    if (result.error) throw result.error;
  },

  deleteService: async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },

  // --- COMPETENCIES (Normalized) ---

  getCompetencies: async (): Promise<CompetencyItem[]> => {
    const { data, error } = await supabase.from('competencies').select('*').order('display_order', { ascending: true });
    
    if (!error && (!data || data.length === 0)) {
        await seedIfAuthenticated('competencies', DEFAULT_COMPETENCIES_DATA);
        return DEFAULT_COMPETENCIES_DATA.map((c: any) => ({
            id: 'temp_' + Math.random(),
            title: c.title,
            subtitle: c.subtitle,
            icon: c.icon,
            items: c.items || [], 
            colorTheme: c.color_theme,
            displayOrder: c.display_order
        }));
    }

    if (error) return [];
    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      icon: c.icon,
      items: c.items || [], // Postgres Array
      colorTheme: c.color_theme,
      displayOrder: c.display_order
    }));
  },

  saveCompetency: async (comp: CompetencyItem) => {
    const dbData = {
      title: comp.title,
      subtitle: comp.subtitle,
      icon: comp.icon,
      items: comp.items,
      color_theme: comp.colorTheme,
      display_order: comp.displayOrder
    };
    let result;
    if (comp.id && comp.id.length > 15 && !comp.id.startsWith('temp_')) {
      result = await supabase.from('competencies').update(dbData).eq('id', comp.id);
    } else {
      result = await supabase.from('competencies').insert(dbData);
    }
    if (result.error) throw result.error;
  },

  deleteCompetency: async (id: string) => {
    const { error } = await supabase.from('competencies').delete().eq('id', id);
    if (error) throw error;
  },

  // --- JOURNEY (Normalized) ---

  getJourney: async (): Promise<JourneyItem[]> => {
    const { data, error } = await supabase.from('journey_items').select('*').order('display_order', { ascending: true });
    
    if (!error && (!data || data.length === 0)) {
        await seedIfAuthenticated('journey_items', DEFAULT_JOURNEY_DATA);
        return DEFAULT_JOURNEY_DATA.map((j: any) => ({
            id: 'temp_' + Math.random(),
            title: j.title,
            company: j.company,
            period: j.period,
            description: j.description,
            type: j.type,
            displayOrder: j.display_order
        }));
    }

    if (error) return [];
    return data.map((j: any) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      period: j.period,
      description: j.description,
      type: j.type,
      displayOrder: j.display_order
    }));
  },

  saveJourneyItem: async (item: JourneyItem) => {
    const dbData = {
      title: item.title,
      company: item.company,
      period: item.period,
      description: item.description,
      type: item.type,
      display_order: item.displayOrder
    };
    let result;
    if (item.id && item.id.length > 15 && !item.id.startsWith('temp_')) {
      result = await supabase.from('journey_items').update(dbData).eq('id', item.id);
    } else {
      result = await supabase.from('journey_items').insert(dbData);
    }
    if (result.error) throw result.error;
  },

  deleteJourneyItem: async (id: string) => {
    const { error } = await supabase.from('journey_items').delete().eq('id', id);
    if (error) throw error;
  },

  // --- AUTH (UPDATED TO SUPABASE AUTH) ---

  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
