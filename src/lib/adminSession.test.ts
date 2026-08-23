/**
 * @jest-environment ./jest.node-fetch-environment.cjs
 */
import { webcrypto } from 'node:crypto';
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEquals,
  createSessionToken,
  getAdminAuthConfig,
  getSessionMaxAge,
  verifySessionToken,
} from './adminSession';

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: webcrypto,
});

const originalEnv = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  secret: process.env.ADMIN_SESSION_SECRET,
};

const secret = 'a'.repeat(32);

beforeEach(() => {
  process.env.ADMIN_USERNAME = '  admin ';
  process.env.ADMIN_PASSWORD = 'password';
  process.env.ADMIN_SESSION_SECRET = secret;
});

afterAll(() => {
  if (originalEnv.username === undefined) delete process.env.ADMIN_USERNAME;
  else process.env.ADMIN_USERNAME = originalEnv.username;
  if (originalEnv.password === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = originalEnv.password;
  if (originalEnv.secret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = originalEnv.secret;
});

describe('getAdminAuthConfig', () => {
  it.each([
    ['missing username', undefined, 'password', secret],
    ['blank username', '', 'password', secret],
    ['missing password', 'admin', undefined, secret],
    ['blank password', 'admin', '', secret],
    ['missing secret', 'admin', 'password', undefined],
  ])('fails closed for %s', (_, username, password, sessionSecret) => {
    if (username === undefined) delete process.env.ADMIN_USERNAME;
    else process.env.ADMIN_USERNAME = username;
    if (password === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = password;
    if (sessionSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = sessionSecret;

    expect(getAdminAuthConfig()).toBeNull();
  });

  it('fails closed when the session secret is shorter than 32 characters', () => {
    process.env.ADMIN_SESSION_SECRET = 'too-short';

    expect(getAdminAuthConfig()).toBeNull();
  });

  it('returns trimmed username and configured credentials on the happy path', () => {
    expect(getAdminAuthConfig()).toEqual({
      username: 'admin',
      password: 'password',
      secret,
    });
  });
});

describe('session helpers', () => {
  it('uses eight hours by default and fourteen days when remembered', () => {
    expect(getSessionMaxAge(false)).toBe(8 * 60 * 60);
    expect(getSessionMaxAge(true)).toBe(14 * 24 * 60 * 60);
  });

  it('compares equal, differing-content, and differing-length strings', () => {
    expect(constantTimeEquals('same', 'same')).toBe(true);
    expect(constantTimeEquals('same', 'SAME')).toBe(false);
    expect(constantTimeEquals('same', 'same-but-longer')).toBe(false);
  });

  it('round-trips a signed token and rejects invalid or expired variants', async () => {
    const token = await createSessionToken(secret, 60);
    expect(token.split('.')).toHaveLength(2);
    expect(await verifySessionToken(secret, token)).toBe(true);
    expect(await verifySessionToken('b'.repeat(32), token)).toBe(false);
    expect(await verifySessionToken(secret, `${token.slice(0, -1)}x`)).toBe(false);
    expect(await verifySessionToken(secret, undefined)).toBe(false);
    expect(await verifySessionToken(secret, 'malformed-token')).toBe(false);
    expect(await verifySessionToken(secret, '%%%.' + token.split('.')[1])).toBe(false);

    const expired = await createSessionToken(secret, -1);
    expect(await verifySessionToken(secret, expired)).toBe(false);
  });

  it('rejects a validly signed payload containing invalid JSON', async () => {
    const payload = Buffer.from('{not-json').toString('base64url');
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const encodedSignature = Buffer.from(signature).toString('base64url');

    expect(await verifySessionToken(secret, `${payload}.${encodedSignature}`)).toBe(false);
  });

  it('exports the expected cookie name', () => {
    expect(ADMIN_SESSION_COOKIE).toBe('creativva_admin_session');
  });
});
