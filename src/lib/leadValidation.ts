export const LEAD_FIELD_LIMITS = {
  name: 80,
  email: 160,
  phone: 24,
  service: 64,
  message: 1000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export interface LeadInput {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export type LeadValidationResult = { ok: true; lead: LeadInput } | { ok: false; error: string };

/**
 * Trims, length-caps and format-checks lead form fields, and restricts the service
 * to the options rendered by the form.
 */
export const validateLead = (
  input: LeadInput,
  allowedServices: readonly string[]
): LeadValidationResult => {
  const name = input.name.trim().slice(0, LEAD_FIELD_LIMITS.name);
  const email = input.email.trim().slice(0, LEAD_FIELD_LIMITS.email);
  const phone = input.phone.trim().slice(0, LEAD_FIELD_LIMITS.phone);
  const service = input.service.trim().slice(0, LEAD_FIELD_LIMITS.service);
  const message = input.message.trim().slice(0, LEAD_FIELD_LIMITS.message);

  if (name.length < 2) {
    return { ok: false, error: 'Please enter your full name.' };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { ok: false, error: 'Please enter a valid phone number.' };
  }
  if (!allowedServices.includes(service)) {
    return { ok: false, error: 'Please select a service from the list.' };
  }

  return { ok: true, lead: { name, email, phone, service, message } };
};
