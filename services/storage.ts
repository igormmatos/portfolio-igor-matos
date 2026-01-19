
import { FormSubmission, ProjectStatus } from '../types';

const STORAGE_KEY = 'requirement_flow_submissions';
const AUTH_KEY = 'requirement_flow_auth';

export const storageService = {
  getSubmissions: (): FormSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSubmission: (submission: FormSubmission) => {
    const submissions = storageService.getSubmissions();
    // Default status for new submissions
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

  isAdminLoggedIn: (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  loginAdmin: (password: string): boolean => {
    // Basic mock authentication as per PRD requirements
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
