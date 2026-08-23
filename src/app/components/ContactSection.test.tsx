import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactSection from './ContactSection';

let observerCallback: IntersectionObserverCallback;
const observeMock = jest.fn();
const disconnectMock = jest.fn();

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
  observeMock.mockReset();
  disconnectMock.mockReset();
  const MockIntersectionObserver = jest.fn(function (callback: IntersectionObserverCallback) {
    observerCallback = callback;
    return {
      disconnect: disconnectMock,
      observe: observeMock,
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
      unobserve: jest.fn(),
    };
  });
  jest
    .spyOn(window, 'IntersectionObserver')
    .mockImplementation(
      MockIntersectionObserver as unknown as (
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) => IntersectionObserver
    );
});

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Casey' } });
  fireEvent.change(screen.getByPlaceholderText('+91 XXXXX XXXXX'), {
    target: { value: '9999999' },
  });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
    target: { value: 'casey@example.com' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'seo-analytics' } });
  fireEvent.change(screen.getByPlaceholderText(/What are you looking/), {
    target: { value: 'Grow' },
  });
};

it('renders required fields and the complete service option set', () => {
  render(<ContactSection />);

  expect(screen.getByPlaceholderText('Your name')).toBeRequired();
  expect(screen.getByPlaceholderText('+91 XXXXX XXXXX')).toBeRequired();
  expect(screen.getByPlaceholderText('your@email.com')).toBeRequired();
  expect(screen.getByRole('combobox')).toBeRequired();

  expect(
    Array.from(screen.getByRole('combobox').querySelectorAll('option')).map((option) => ({
      label: option.textContent,
      value: option.getAttribute('value'),
    }))
  ).toEqual([
    { label: 'Select a service', value: '' },
    { label: 'Social Media Marketing', value: 'social-media-marketing' },
    { label: 'Content Creation', value: 'content-creation' },
    { label: 'Paid Advertising', value: 'paid-advertising' },
    { label: 'SEO & Analytics', value: 'seo-analytics' },
    { label: 'Social Media Management', value: 'social-media-management' },
    { label: 'Brand Identity & Strategy', value: 'brand-identity' },
    { label: 'Performance Marketing', value: 'performance-marketing' },
    { label: 'Content Creation & Video Editing', value: 'video-editing' },
  ]);
});

it('renders the contact detail links with their destinations', () => {
  render(<ContactSection />);

  expect(screen.getByRole('link', { name: /Call Us/ })).toHaveAttribute(
    'href',
    'tel:+917415072820'
  );
  expect(screen.getByRole('link', { name: /Email Us/ })).toHaveAttribute(
    'href',
    'mailto:creativvalab@gmail.com'
  );
  expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
    'href',
    'https://wa.me/917415072820'
  );
});

it('animates both panels when the section intersects', () => {
  const { container } = render(<ContactSection />);
  const leftPanel = container.querySelector('.space-y-6') as HTMLElement;
  const rightPanel = container.querySelector('.grid > div:last-child') as HTMLElement;

  observerCallback(
    [{ isIntersecting: false } as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
  expect(leftPanel).not.toHaveClass('animate-slide-left');
  expect(rightPanel).not.toHaveClass('animate-slide-right');
  expect(leftPanel).toHaveStyle({ opacity: '0' });
  expect(rightPanel).toHaveStyle({ opacity: '0' });

  observerCallback(
    [{ isIntersecting: true } as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
  expect(leftPanel).toHaveClass('animate-slide-left');
  expect(rightPanel).toHaveClass('animate-slide-right');
  expect(leftPanel).toHaveStyle({ opacity: '1' });
  expect(rightPanel).toHaveStyle({ opacity: '1' });
});

it('disconnects the intersection observer when unmounted', () => {
  const { unmount } = render(<ContactSection />);

  unmount();

  expect(disconnectMock).toHaveBeenCalledTimes(1);
});

it('controls fields and appends a visible lead on submit', async () => {
  localStorage.setItem('creativva_leads', JSON.stringify([{ name: 'Existing' }]));
  render(<ContactSection />);
  fillForm();
  expect(screen.getByDisplayValue('Casey')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Send My Inquiry/ }));
  await waitFor(() => expect(screen.getByText('Message Received!')).toBeInTheDocument());
  const saved = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
  expect(saved).toHaveLength(2);
  expect(saved[1]).toMatchObject({ name: 'Casey', service: 'seo-analytics', hideDetails: false });
  expect(saved[1].timestamp).toEqual(expect.any(String));
});

it('trims and caps valid fields before storing the lead', async () => {
  render(<ContactSection />);
  fireEvent.change(screen.getByPlaceholderText('Your name'), {
    target: { value: `  ${'A'.repeat(90)}  ` },
  });
  fireEvent.change(screen.getByPlaceholderText('+91 XXXXX XXXXX'), {
    target: { value: ' +91 7415072820 ' },
  });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
    target: { value: ' casey@example.com ' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'seo-analytics' } });
  fireEvent.change(screen.getByPlaceholderText(/What are you looking/), {
    target: { value: ` ${'B'.repeat(1100)} ` },
  });

  fireEvent.click(screen.getByRole('button', { name: /Send My Inquiry/ }));
  await waitFor(() => expect(screen.getByText('Message Received!')).toBeInTheDocument());

  const saved = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
  expect(saved[0]).toMatchObject({
    name: 'A'.repeat(80),
    phone: '+91 7415072820',
    email: 'casey@example.com',
    service: 'seo-analytics',
    message: 'B'.repeat(1000),
  });
});

it.each([
  ['short name', 'name', 'A', 'Please enter your full name.'],
  ['malformed email', 'email', 'not-an-email', 'Please enter a valid email address.'],
  ['bad phone', 'phone', 'abc', 'Please enter a valid phone number.'],
  ['unknown service', 'service', 'not-a-service', 'Please select a service from the list.'],
] as const)(
  'rejects %s, stores nothing, and clears the error on change',
  async (_, field, value, error) => {
    render(<ContactSection />);
    fillForm();
    fireEvent.change(
      field === 'name'
        ? screen.getByPlaceholderText('Your name')
        : field === 'email'
          ? screen.getByPlaceholderText('your@email.com')
          : field === 'phone'
            ? screen.getByPlaceholderText('+91 XXXXX XXXXX')
            : screen.getByRole('combobox'),
      { target: { value } }
    );
    fireEvent.submit(screen.getByRole('button', { name: /Send My Inquiry/ }).closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent(error);
    expect(localStorage.getItem('creativva_leads')).toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/What are you looking/), {
      target: { value: 'changed' },
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }
);

it('appends a new lead after several existing entries', async () => {
  const existingLeads = [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }];
  localStorage.setItem('creativva_leads', JSON.stringify(existingLeads));
  render(<ContactSection />);

  fillForm();
  fireEvent.click(screen.getByRole('button', { name: /Send My Inquiry/ }));
  await waitFor(() => expect(screen.getByText('Message Received!')).toBeInTheDocument());

  const saved = JSON.parse(localStorage.getItem('creativva_leads') || '[]');
  expect(saved).toHaveLength(4);
  expect(saved.slice(0, 3)).toEqual(existingLeads);
  expect(saved[3]).toMatchObject({ name: 'Casey', hideDetails: false });
});

it('keeps the success state when localStorage throws', async () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('storage unavailable');
  });
  render(<ContactSection />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: /Send My Inquiry/ }));
  await waitFor(() => expect(screen.getByText('Message Received!')).toBeInTheDocument());
});
