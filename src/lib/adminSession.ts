export const ADMIN_SESSION_COOKIE = 'creativva_admin_session';

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8;
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const importKey = (secret: string) =>
  crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);

const sign = async (secret: string, payload: string) => {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
};

export interface AdminAuthConfig {
  username: string;
  password: string;
  secret: string;
}

/**
 * Reads admin credentials from server-only environment variables. Returns null when
 * the deployment has not been configured, so callers can fail closed.
 */
export const getAdminAuthConfig = (): AdminAuthConfig | null => {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret || secret.length < 32) {
    return null;
  }

  return { username, password, secret };
};

export const getSessionMaxAge = (remember: boolean) =>
  remember ? REMEMBER_MAX_AGE_SECONDS : DEFAULT_MAX_AGE_SECONDS;

export const constantTimeEquals = (a: string, b: string) => {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const length = Math.max(aBytes.length, bBytes.length);
  let mismatch = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return mismatch === 0;
};

export const createSessionToken = async (secret: string, maxAgeSeconds: number) => {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        exp: Date.now() + maxAgeSeconds * 1000,
        nonce: toBase64Url(crypto.getRandomValues(new Uint8Array(16))),
      })
    )
  );
  return `${payload}.${await sign(secret, payload)}`;
};

export const verifySessionToken = async (secret: string, token: string | undefined) => {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  let expected: string;
  try {
    expected = await sign(secret, payload);
  } catch {
    return false;
  }
  if (!constantTimeEquals(expected, signature)) return false;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      exp?: number;
    };
    return typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
};
