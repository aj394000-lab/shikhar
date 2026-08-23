import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEquals,
  createSessionToken,
  getAdminAuthConfig,
  getSessionMaxAge,
} from '@/lib/adminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

const isRateLimited = (key: string) => {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
};

export async function POST(request: Request) {
  const config = getAdminAuthConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured on the server.' },
      { status: 503 }
    );
  }

  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { username, password, remember } = (body ?? {}) as {
    username?: unknown;
    password?: unknown;
    remember?: unknown;
  };

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const usernameMatches = constantTimeEquals(username.trim(), config.username);
  const passwordMatches = constantTimeEquals(password, config.password);
  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  const maxAge = getSessionMaxAge(remember === true);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createSessionToken(config.secret, maxAge),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
  return response;
}
