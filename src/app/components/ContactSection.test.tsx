import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactSection from './ContactSection';

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Casey' } });
  fireEvent.change(screen.getByPlaceholderText('+91 XXXXX XXXXX'), { target: { value: '999' } });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
    target: { value: 'casey@example.com' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'seo-analytics' } });
  fireEvent.change(screen.getByPlaceholderText(/What are you looking/), {
    target: { value: 'Grow' },
  });
};

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

it('keeps the success state when localStorage throws', async () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('storage unavailable');
  });
  render(<ContactSection />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: /Send My Inquiry/ }));
  await waitFor(() => expect(screen.getByText('Message Received!')).toBeInTheDocument());
});
