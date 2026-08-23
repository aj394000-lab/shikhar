/**
 * @jest-environment ./jest.node-fetch-environment.cjs
 */
import { POST } from './route';
import { ADMIN_SESSION_COOKIE, getSessionMaxAge } from '@/lib/adminSession';

const secret = 'a'.repeat(32);
let ipCounter = 0;

beforeEach(() => {
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'password';
  process.env.ADMIN_SESSION_SECRET = secret;
  ipCounter += 1;
});

afterAll(() => {
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
});

const requestFor = (body: string, ip = `192.0.2.${ipCounter}`) =>
  new Request('http://localhost/api/admin/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body,
  });

it('returns 503 when admin authentication is not configured', async () => {
  delete process.env.ADMIN_USERNAME;

  const response = await POST(
    requestFor(JSON.stringify({ username: 'admin', password: 'password' }))
  );

  expect(response.status).toBe(503);
  await expect(response.json()).resolves.toEqual({
    error: 'Admin authentication is not configured on the server.',
  });
});

it('returns 400 for malformed JSON and non-string credentials', async () => {
  const malformed = await POST(requestFor('{not-json'));
  expect(malformed.status).toBe(400);
  await expect(malformed.json()).resolves.toEqual({ error: 'Invalid request body.' });

  const invalidFields = await POST(requestFor(JSON.stringify({ username: 42, password: null })));
  expect(invalidFields.status).toBe(400);
  await expect(invalidFields.json()).resolves.toEqual({
    error: 'Username and password are required.',
  });
});

it('returns 401 for incorrect credentials', async () => {
  const response = await POST(requestFor(JSON.stringify({ username: 'admin', password: 'wrong' })));

  expect(response.status).toBe(401);
  await expect(response.json()).resolves.toEqual({ error: 'Incorrect username or password.' });
});

it('rate-limits after eight attempts from the same client', async () => {
  const body = JSON.stringify({ username: 'admin', password: 'wrong' });
  const responses = [];
  for (let attempt = 0; attempt < 9; attempt += 1) {
    responses.push(await POST(requestFor(body, '198.51.100.8')));
  }

  expect(responses.slice(0, 8).every((response) => response.status === 401)).toBe(true);
  expect(responses[8].status).toBe(429);
  await expect(responses[8].json()).resolves.toEqual({
    error: 'Too many attempts. Try again in a few minutes.',
  });
});

it('sets an httpOnly eight-hour cookie for a normal login', async () => {
  const response = await POST(
    requestFor(JSON.stringify({ username: ' admin ', password: 'password' }))
  );
  const cookie = response.cookies.get(ADMIN_SESSION_COOKIE);

  expect(response.status).toBe(200);
  expect(cookie?.value).toEqual(expect.any(String));
  expect(response.headers.get('set-cookie')).toContain(`${ADMIN_SESSION_COOKIE}=`);
  expect(response.headers.get('set-cookie')?.toLowerCase()).toContain('httponly');
  expect(response.headers.get('set-cookie')).toContain(`Max-Age=${getSessionMaxAge(false)}`);
});

it('sets a fourteen-day cookie when remember is requested', async () => {
  const response = await POST(
    requestFor(JSON.stringify({ username: 'admin', password: 'password', remember: true }))
  );

  expect(response.headers.get('set-cookie')).toContain(`Max-Age=${getSessionMaxAge(true)}`);
});
