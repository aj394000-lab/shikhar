import { LEAD_FIELD_LIMITS, validateLead, type LeadInput } from './leadValidation';

const validInput: LeadInput = {
  name: ' Casey ',
  phone: ' +91 7415072820 ',
  email: ' casey@example.com ',
  service: 'seo',
  message: ' Grow ',
};

const allowedServices = ['seo', 'content-creation'];

describe('validateLead', () => {
  it('returns a trimmed and length-capped normalized lead', () => {
    const result = validateLead(
      {
        ...validInput,
        name: ` ${'A'.repeat(LEAD_FIELD_LIMITS.name + 10)} `,
        email: ` ${'a'.repeat(140)}@example.com `,
        phone: ' +91 7415072820 ',
        message: ` ${'B'.repeat(LEAD_FIELD_LIMITS.message + 10)} `,
      },
      allowedServices
    );

    expect(result).toEqual({
      ok: true,
      lead: {
        name: 'A'.repeat(LEAD_FIELD_LIMITS.name),
        email: `${'a'.repeat(140)}@example.com`,
        phone: '+91 7415072820',
        service: 'seo',
        message: 'B'.repeat(LEAD_FIELD_LIMITS.message),
      },
    });
  });

  it.each([
    ['empty name', { name: ' ' }, 'Please enter your full name.'],
    ['one-character name', { name: 'A' }, 'Please enter your full name.'],
    ['malformed email', { email: 'casey.example.com' }, 'Please enter a valid email address.'],
    ['missing email domain', { email: 'casey@example' }, 'Please enter a valid email address.'],
    ['bad phone characters', { phone: 'abc12345' }, 'Please enter a valid phone number.'],
    ['short phone', { phone: '123456' }, 'Please enter a valid phone number.'],
    ['unknown service', { service: 'unknown' }, 'Please select a service from the list.'],
  ] as const)('rejects %s', (_, override, error) => {
    const result = validateLead({ ...validInput, ...override }, allowedServices);

    expect(result).toEqual({ ok: false, error });
  });

  it.each(['casey@example.com', 'a+b@sub.example.co', 'USER@DOMAIN.IO'])(
    'accepts email %s',
    (email) => {
      expect(validateLead({ ...validInput, email }, allowedServices).ok).toBe(true);
    }
  );

  it.each(['1234567', '+91 74150 72820', '(741) 507-2820', ' 12345678901234567890 '])(
    'accepts phone %s',
    (phone) => {
      expect(validateLead({ ...validInput, phone }, allowedServices).ok).toBe(true);
    }
  );

  it.each(['123456', '123456789012345678901', '++1234567', '123-abc-456'])(
    'rejects phone %s',
    (phone) => {
      expect(validateLead({ ...validInput, phone }, allowedServices)).toEqual({
        ok: false,
        error: 'Please enter a valid phone number.',
      });
    }
  );
});
