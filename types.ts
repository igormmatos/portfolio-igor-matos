
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

export interface AppState {
  submissions: FormSubmission[];
}
