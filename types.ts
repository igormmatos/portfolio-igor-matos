
export enum FieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX',
}

export enum ProjectStatus {
  NOT_STARTED = 'Não Iniciado',
  STARTED = 'Iniciado',
  NEEDS_ADJUSTMENTS = 'Necessário Ajustes',
  FINISHED = 'Finalizado',
}

export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FormOption[];
  required?: boolean;
  dependsOn?: {
    fieldId: string;
    value: string;
  };
}

export interface FormSubmission {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  isWhatsApp: boolean;
  answers: Record<string, any>;
  status?: ProjectStatus;
}

// --- NOVAS INTERFACES PARA A LANDING PAGE ---

export interface PortfolioProject {
  id: string;
  title: string;
  role?: string; // Novo campo: Papel no projeto
  description: string;
  technologies: string; // Ex: "React, Node.js"
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string; // Opcional, usaremos placeholder se não houver
}

export interface SiteService {
  id: string;
  title: string;
  description: string;
  icon: string; // FontAwesome class
}

export interface SiteCompetency {
  id: string;
  title: string;
  subtitle?: string; // Novo campo: Descrição curta
  icon: string;
  items: string[];
  colorTheme: 'blue' | 'indigo' | 'cyan';
}

export interface SiteContent {
  profileName: string;
  profileTitle: string;
  profileBio: string;
  whatsappNumber: string;
  services: SiteService[];
  competencies: SiteCompetency[];
}

export interface AppState {
  submissions: FormSubmission[];
}
