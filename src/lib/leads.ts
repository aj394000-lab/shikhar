const LEADS_STORAGE_KEY = 'creativva_leads';

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  timestamp: string;
  hideDetails?: boolean;
}

export interface LeadStorageError {
  code: 'unavailable' | 'read' | 'write' | 'corrupt';
  message: string;
  cause: unknown;
}

export type LeadStorageResult<T> = { ok: true; value: T } | { ok: false; error: LeadStorageError };

const failure = (
  code: LeadStorageError['code'],
  message: string,
  cause: unknown = new Error(message)
): LeadStorageResult<never> => ({
  ok: false,
  error: { code, message, cause },
});

const getLeadStorage = (): LeadStorageResult<Storage> => {
  if (typeof window === 'undefined') {
    return failure('unavailable', 'Lead storage is unavailable outside the browser.');
  }

  if (!('localStorage' in window)) {
    return failure('unavailable', 'This browser does not provide lead storage.');
  }

  try {
    const storage = window.localStorage;
    if (!storage) {
      return failure('unavailable', 'This browser does not provide lead storage.');
    }
    return { ok: true, value: storage };
  } catch (cause) {
    return failure('unavailable', 'Lead storage is unavailable in this browser.', cause);
  }
};

const parseLead = (value: unknown): Lead | null => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.name !== 'string' ||
    typeof record.phone !== 'string' ||
    typeof record.email !== 'string' ||
    typeof record.service !== 'string' ||
    typeof record.timestamp !== 'string'
  ) {
    return null;
  }

  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    name: record.name,
    phone: record.phone,
    email: record.email,
    service: record.service,
    message: typeof record.message === 'string' ? record.message : '',
    timestamp: record.timestamp,
    hideDetails: typeof record.hideDetails === 'boolean' ? record.hideDetails : undefined,
  };
};

export const readLeads = (): LeadStorageResult<Lead[]> => {
  const storageResult = getLeadStorage();
  if (!storageResult.ok) return storageResult;

  let stored: string | null;
  try {
    stored = storageResult.value.getItem(LEADS_STORAGE_KEY);
  } catch (cause) {
    return failure('read', 'Leads could not be read from this browser.', cause);
  }

  if (stored === null || stored.trim() === '') {
    return { ok: true, value: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (cause) {
    return failure('corrupt', 'Saved lead data is corrupt and could not be read.', cause);
  }

  if (!Array.isArray(parsed)) {
    return failure('corrupt', 'Saved lead data is corrupt and is not a list of leads.');
  }

  const leads = parsed.map(parseLead).filter((lead): lead is Lead => lead !== null);
  if (parsed.length > 0 && leads.length === 0) {
    return failure('corrupt', 'Saved lead data is corrupt and contains no valid leads.');
  }

  return { ok: true, value: leads };
};

export const writeLeads = (leads: Lead[]): LeadStorageResult<void> => {
  const storageResult = getLeadStorage();
  if (!storageResult.ok) return storageResult;

  try {
    storageResult.value.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    return { ok: true, value: undefined };
  } catch (cause) {
    return failure('write', 'Leads could not be saved in this browser.', cause);
  }
};

export const appendLead = (lead: Lead): LeadStorageResult<void> => {
  const existingResult = readLeads();
  if (!existingResult.ok) return existingResult;
  return writeLeads([...existingResult.value, lead]);
};
