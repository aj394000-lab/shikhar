import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AdminPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const routerReplace = jest.fn();
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

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
  routerReplace.mockReset();
  (useRouter as jest.Mock).mockReturnValue({ replace: routerReplace });
});

const renderAdmin = async (storedLeads = leads) => {
  localStorage.setItem('creativva_leads', JSON.stringify(storedLeads));
  render(<AdminPage />);
  await waitFor(() => expect(screen.getByText('Lead Submissions')).toBeInTheDocument());
};

describe('AdminPage lead hydration', () => {
  it('sorts leads newest first, backfills missing ids, and persists normalized data', async () => {
    await renderAdmin();

    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Alice')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
    expect(saved).toHaveLength(2);
    expect(saved.every((lead: { id?: string }) => lead.id)).toBe(true);
  });

  it('falls back to an empty list for malformed localStorage data', async () => {
    localStorage.setItem('creativva_leads', '{not-json');
    render(<AdminPage />);

    await waitFor(() => expect(screen.getByText('No leads yet')).toBeInTheDocument());
  });
});

describe('AdminPage lead controls', () => {
  beforeEach(async () => {
    await renderAdmin();
  });

  it('filters across lead fields and service labels while hiding private details', () => {
    expect(screen.queryByText('Secret details')).not.toBeInTheDocument();
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

  it('selects all visible leads and clears the selection', () => {
    const rows = screen.getAllByRole('row');
    fireEvent.click(within(rows[0]).getByRole('checkbox'));
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.queryByText('2 selected')).not.toBeInTheDocument();
  });

  it('keeps selected leads when bulk deletion is cancelled and deletes them when confirmed', async () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    const rows = screen.getAllByRole('row');
    fireEvent.click(within(rows[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    expect(confirm).toHaveBeenCalledWith('Delete 1 selected lead? This cannot be undone.');
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(2);

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    await waitFor(() => expect(screen.getByText('Showing 1 of 1 leads')).toBeInTheDocument());
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(1);
  });

  it('deletes an individual lead only after confirmation', async () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(confirm).toHaveBeenCalledWith('Delete this lead? This action cannot be undone.');
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(2);

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    await waitFor(() => expect(screen.getByText('Showing 1 of 1 leads')).toBeInTheDocument());
    expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')).toHaveLength(1);
  });

  it('exports escaped CSV values and blanks private details', async () => {
    const header = screen.getAllByRole('row')[0];
    fireEvent.click(within(header).getByRole('checkbox'));
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
    expect(csv).toContain('"Bob","bob@example.com","222","Social Media Marketing","",""');
    expect(csv).toContain('Older ""message""');
  });

  it('logs out through the API and redirects even when logout fails', async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error('offline'));
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });
    const button = screen.getByRole('button', { name: 'Lock Admin' });
    const propsKey = Object.keys(button).find((key) => key.startsWith('__reactProps'));
    const onClick = (button as unknown as Record<string, { onClick: () => Promise<void> }>)[
      propsKey!
    ].onClick;

    await expect(onClick()).rejects.toThrow('offline');
    expect(routerReplace).toHaveBeenCalledWith('/admin/login');
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/logout', { method: 'POST' });
  });
});
