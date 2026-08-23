import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AdminLoginPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

const routerReplace = jest.fn();

beforeEach(() => {
  routerReplace.mockReset();
  (useRouter as jest.Mock).mockReturnValue({ replace: routerReplace });
});

const setFetch = (implementation: () => Promise<unknown>) => {
  const fetchMock = jest.fn(implementation);
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
};

it('submits credentials and redirects after a successful login', async () => {
  const fetchMock = setFetch(() => Promise.resolve({ ok: true }));
  render(<AdminLoginPage />);

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Unlock Admin Panel' }));

  await waitFor(() => expect(routerReplace).toHaveBeenCalledWith('/admin'));
  expect(fetchMock).toHaveBeenCalledWith('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'secret', remember: true }),
  });
});

it('displays a server error and clears it when credentials change', async () => {
  setFetch(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Too many attempts.' }),
    })
  );
  render(<AdminLoginPage />);

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Unlock Admin Panel' }));

  expect(await screen.findByText('Too many attempts.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'another' } });
  expect(screen.queryByText('Too many attempts.')).not.toBeInTheDocument();
});

it('shows a network error when the login request cannot be reached', async () => {
  setFetch(() => Promise.reject(new Error('offline')));
  render(<AdminLoginPage />);

  fireEvent.click(screen.getByRole('button', { name: 'Unlock Admin Panel' }));

  expect(await screen.findByText('Could not reach the server. Try again.')).toBeInTheDocument();
});
