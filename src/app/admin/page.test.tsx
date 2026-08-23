import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AdminPage from './page';

const leads = [
  {
    id: 'older',
    name: 'Alice',
    email: 'alice@example.com',
    phone: '111',
    service: 'seo',
    message: 'Older "message"',
    timestamp: '2025-01-01T10:00:00.000Z',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    phone: '222',
    service: 'social-media',
    message: 'Secret details',
    timestamp: '2025-01-03T10:00:00.000Z',
    hideDetails: true,
  },
];

const unlock = async (remember = false, username = 'ShikharBoss', password = 'creativva2006') => {
  await waitFor(() => expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument());
  fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: username } });
  fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: password } });
  if (remember) fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Unlock Admin Panel' }));
  await waitFor(() => expect(screen.getByText('Lead Submissions')).toBeInTheDocument());
};

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
  delete process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  delete process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
});

describe('AdminPage access and lead loading', () => {
  it('renders the login gate and unlocks with the default credentials', async () => {
    render(<AdminPage />);
    await unlock();
    expect(localStorage.getItem('creativva_admin_session')).toBe('true');
    expect(localStorage.getItem('creativva_admin_unlocked')).toBeNull();
  });

  it('supports configured credentials and remembers or omits the persistent lock', async () => {
    process.env.NEXT_PUBLIC_ADMIN_USERNAME = 'configured-user';
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD = 'configured-pass';
    const { unmount } = render(<AdminPage />);
    await unlock(true, 'configured-user', 'configured-pass');
    expect(localStorage.getItem('creativva_admin_unlocked')).toBe('true');

    unmount();
    localStorage.clear();
    render(<AdminPage />);
    await unlock(false, 'configured-user', 'configured-pass');
    expect(localStorage.getItem('creativva_admin_unlocked')).toBeNull();
    expect(localStorage.getItem('creativva_admin_session')).toBe('true');
  });

  it('shows and clears the wrong-credentials error while typing', async () => {
    render(<AdminPage />);
    await waitFor(() => screen.getByPlaceholderText('Enter username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Unlock Admin Panel' }));
    expect(screen.getByText('Incorrect username or password. Try again.')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'new' } });
    expect(
      screen.queryByText('Incorrect username or password. Try again.')
    ).not.toBeInTheDocument();
  });

  it('bypasses the gate for either existing unlock key', async () => {
    localStorage.setItem('creativva_admin_unlocked', 'true');
    const { unmount } = render(<AdminPage />);
    await waitFor(() => expect(screen.getByText('Lead Submissions')).toBeInTheDocument());
    unmount();
    localStorage.clear();
    localStorage.setItem('creativva_admin_session', 'true');
    render(<AdminPage />);
    await waitFor(() => expect(screen.getByText('Lead Submissions')).toBeInTheDocument());
  });

  it('sorts leads newest first, backfills missing ids, and handles malformed storage', async () => {
    localStorage.setItem('creativva_leads', JSON.stringify(leads));
    render(<AdminPage />);
    await unlock();
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Alice')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
    expect(saved).toHaveLength(2);
    expect(saved.every((lead: { id?: string }) => lead.id)).toBe(true);

    localStorage.clear();
    localStorage.setItem('creativva_admin_session', 'true');
    localStorage.setItem('creativva_leads', '{not-json');
    const { unmount } = render(<AdminPage />);
    await waitFor(() => expect(screen.getByText('No leads yet')).toBeInTheDocument());
    unmount();
  });
});

describe('AdminPage lead controls', () => {
  beforeEach(async () => {
    localStorage.setItem('creativva_admin_session', 'true');
    localStorage.setItem('creativva_leads', JSON.stringify(leads));
    render(<AdminPage />);
    await waitFor(() => expect(screen.getByText('Lead Submissions')).toBeInTheDocument());
  });

  it('filters by lead fields and service labels and hides private details', () => {
    expect(screen.queryByText('Secret details')).not.toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2);
    const search = screen.getByPlaceholderText('Search leads...');
    fireEvent.change(search, { target: { value: 'seo & analytics' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'secret' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'alice@example.com' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    fireEvent.change(search, { target: { value: '111' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('toggles individual and all selections and deletes with confirmation', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const rows = screen.getAllByRole('row');
    fireEvent.click(within(rows[1]).getByRole('checkbox'));
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    expect(window.confirm).toHaveBeenCalled();
  });

  it('persists selected and individual deletion only after confirmation', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const rows = screen.getAllByRole('row');
    fireEvent.click(within(rows[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(2);
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    await waitFor(() => expect(screen.getByText('Showing 1 of 1 leads')).toBeInTheDocument());
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.getByText('No leads yet')).toBeInTheDocument());
    expect(localStorage.getItem('creativva_leads')).toBe('[]');
  });

  it('selects all visible leads and exports escaped CSV with private columns blank', async () => {
    const rows = screen.getAllByRole('row');
    fireEvent.click(within(rows[0]).getByRole('checkbox'));
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: () => 'blob:test',
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: () => {},
    });
    jest.spyOn(globalThis, 'Blob').mockImplementation((parts: BlobPart[] = []) => {
      return {
        text: () => Promise.resolve(parts.map((part) => String(part)).join('')),
      } as unknown as Blob;
    });
    const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Export 2 Selected' }));
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
    expect(click).toHaveBeenCalled();
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    const csv = await blob.text();
    expect(csv).toContain('Name,Email,Phone,Service,Message,Submitted At');
    expect(csv).toContain('"Social Media Marketing","",""');
    expect(csv).toContain('Older ""message""');
  });
});
