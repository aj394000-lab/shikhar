export const LEADS_STORAGE_KEY = 'creativva_leads';

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export interface Lead extends LeadFormData {
  id?: string;
  timestamp: string;
  // When true, admin UI should omit showing message/timestamp for privacy/UX
  hideDetails?: boolean;
}

export const EMPTY_LEAD_FORM: LeadFormData = {
  name: '',
  phone: '',
  email: '',
  service: '',
  message: '',
};

export function readStoredLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]') as Lead[];
  } catch {
    return [];
  }
}

export function persistLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

export function saveLead(formData: LeadFormData, hideDetails: boolean): Lead {
  const lead: Lead = {
    ...formData,
    timestamp: new Date().toISOString(),
    hideDetails,
  };
  try {
    persistLeads([...readStoredLeads(), lead]);
  } catch {
    // ignore localStorage errors
  }
  return lead;
}
