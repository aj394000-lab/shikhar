/**
 * @jest-environment ./jest.node-fetch-environment.cjs
 */
import { POST } from './route';
import { ADMIN_SESSION_COOKIE } from '@/lib/adminSession';

it('clears the admin session cookie', async () => {
  const response = await POST();
  const cookie = response.cookies.get(ADMIN_SESSION_COOKIE);

  expect(response.status).toBe(200);
  expect(cookie).toMatchObject({ name: ADMIN_SESSION_COOKIE, value: '' });
  expect(response.headers.get('set-cookie')).toContain(`${ADMIN_SESSION_COOKIE}=`);
  expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  expect(response.headers.get('set-cookie')?.toLowerCase()).toContain('httponly');
});
