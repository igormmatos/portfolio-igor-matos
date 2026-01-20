
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

// --- PORTFOLIO & SITE CONTENT (NORMALIZED) ---

export interface PortfolioProject {
  id: string;
  title: string;
  role?: string;
  description: string;
  technologies: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface ProfileInfo {
  id?: string;
  displayName: string;
  headline: string;
  bio: string;
  whatsapp: string;
  email: string;
  linkedinUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface CompetencyItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  items: string[]; // Agora mapeia para text[] do postgres
  colorTheme: 'blue' | 'indigo' | 'cyan';
  displayOrder: number;
}

export interface JourneyItem {
  id: string;
  title: string;
  company?: string;
  period?: string;
  description: string;
  type: 'work' | 'education';
  displayOrder: number;
}
