/**
 * @jest-environment ./jest.node-fetch-environment.cjs
 */
import { NextRequest } from 'next/server';
import { createSessionToken } from '@/lib/adminSession';
import { middleware } from './middleware';

const secret = 'a'.repeat(32);

beforeEach(() => {
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'password';
  process.env.ADMIN_SESSION_SECRET = secret;
});

afterAll(() => {
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
});

const requestFor = (path: string, token?: string) => {
  const request = new NextRequest(`http://localhost${path}`);
  if (token) request.cookies.set('creativva_admin_session', token);
  return request;
};

it('redirects unauthenticated admin pages to the login route', async () => {
  const response = await middleware(requestFor('/admin'));

  expect(response.headers.get('location')).toBe('http://localhost/admin/login');
});

it('allows unauthenticated access to the login route', async () => {
  const response = await middleware(requestFor('/admin/login'));

  expect(response.status).toBe(200);
  expect(response.headers.get('location')).toBeNull();
});

it('redirects an authenticated visitor away from the login route', async () => {
  const token = await createSessionToken(secret, 60);
  const response = await middleware(requestFor('/admin/login', token));

  expect(response.headers.get('location')).toBe('http://localhost/admin');
});

it('allows an authenticated visitor into the admin page', async () => {
  const token = await createSessionToken(secret, 60);
  const response = await middleware(requestFor('/admin', token));

  expect(response.status).toBe(200);
  expect(response.headers.get('location')).toBeNull();
});

it('fails closed when authentication is not configured', async () => {
  delete process.env.ADMIN_SESSION_SECRET;
  const response = await middleware(requestFor('/admin'));

  expect(response.headers.get('location')).toBe('http://localhost/admin/login');
});
