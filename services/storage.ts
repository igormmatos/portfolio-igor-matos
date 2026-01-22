
import { PortfolioProject, ProfileInfo, ServiceItem, CompetencyItem, JourneyItem, FormSubmission } from '../types';
import { supabase } from './supabase';

export const storageService = {
  // --- PORTFOLIO ---

  getProjects: async (): Promise<PortfolioProject[]> => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

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

  saveProject: async (project: PortfolioProject): Promise<PortfolioProject> => {
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
      result = await supabase.from('projects').update(dbProject).eq('id', project.id).select().single();
    } else {
      result = await supabase.from('projects').insert(dbProject).select().single();
    }
    
    if (result.error) throw result.error;
    
    const p = result.data;
    return {
      id: p.id,
      title: p.title,
      role: p.role,
      description: p.description,
      technologies: p.technologies,
      githubUrl: p.github_url,
      liveUrl: p.live_url,
      imageUrl: p.image_url
    };
  },

  deleteProject: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // --- PROFILE INFO (Singleton) ---

  getProfileInfo: async (): Promise<ProfileInfo | null> => {
    const { data, error } = await supabase.from('profile_info').select('*').limit(1);
    
    if (error || !data || data.length === 0) return null;
    
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

  saveProfileInfo: async (info: ProfileInfo): Promise<ProfileInfo> => {
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
      result = await supabase.from('profile_info').update(dbData).eq('id', info.id).select().single();
    } else {
      result = await supabase.from('profile_info').insert(dbData).select().single();
    }
    if (result.error) throw result.error;
    
    const row = result.data;
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

  // --- SERVICES (Normalized) ---

  getServices: async (): Promise<ServiceItem[]> => {
    const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    if (error) return [];
    return data.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
      displayOrder: s.display_order
    }));
  },

  saveService: async (service: ServiceItem): Promise<ServiceItem> => {
    const dbData = {
      title: service.title,
      description: service.description,
      icon: service.icon,
      display_order: service.displayOrder
    };
    let result;
    if (service.id && service.id.length > 15 && !service.id.startsWith('temp_')) {
      result = await supabase.from('services').update(dbData).eq('id', service.id).select().single();
    } else {
      result = await supabase.from('services').insert(dbData).select().single();
    }
    if (result.error) throw result.error;
    
    const s = result.data;
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
      displayOrder: s.display_order
    };
  },

  deleteService: async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },

  // --- COMPETENCIES (Normalized) ---

  getCompetencies: async (): Promise<CompetencyItem[]> => {
    const { data, error } = await supabase.from('competencies').select('*').order('display_order', { ascending: true });
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

  saveCompetency: async (comp: CompetencyItem): Promise<CompetencyItem> => {
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
      result = await supabase.from('competencies').update(dbData).eq('id', comp.id).select().single();
    } else {
      result = await supabase.from('competencies').insert(dbData).select().single();
    }
    if (result.error) throw result.error;
    
    const c = result.data;
    return {
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      icon: c.icon,
      items: c.items || [],
      colorTheme: c.color_theme,
      displayOrder: c.display_order
    };
  },

  deleteCompetency: async (id: string) => {
    const { error } = await supabase.from('competencies').delete().eq('id', id);
    if (error) throw error;
  },

  // --- JOURNEY (Normalized) ---

  getJourney: async (): Promise<JourneyItem[]> => {
    const { data, error } = await supabase.from('journey_items').select('*').order('display_order', { ascending: true });
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

  saveJourneyItem: async (item: JourneyItem): Promise<JourneyItem> => {
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
      result = await supabase.from('journey_items').update(dbData).eq('id', item.id).select().single();
    } else {
      result = await supabase.from('journey_items').insert(dbData).select().single();
    }
    if (result.error) throw result.error;
    
    const j = result.data;
    return {
      id: j.id,
      title: j.title,
      company: j.company,
      period: j.period,
      description: j.description,
      type: j.type,
      displayOrder: j.display_order
    };
  },

  deleteJourneyItem: async (id: string) => {
    const { error } = await supabase.from('journey_items').delete().eq('id', id);
    if (error) throw error;
  },

  // --- SUBMISSIONS ---

  saveSubmission: async (submission: FormSubmission): Promise<void> => {
    const dbData = {
      user_name: submission.userName,
      user_email: submission.userEmail,
      user_phone: submission.userPhone,
      is_whatsapp: submission.isWhatsApp,
      answers: submission.answers,
      created_at: submission.timestamp || new Date().toISOString()
    };

    const { error } = await supabase.from('form_submissions').insert(dbData);
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
