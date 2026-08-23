import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import LeadPopup from './LeadPopup';

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const showPopup = async () => {
  render(<LeadPopup />);
  act(() => {
    jest.advanceTimersByTime(3500);
  });
  await waitFor(() => expect(screen.getByText('Free Consultation')).toBeInTheDocument());
};

const fillPopup = () => {
  fireEvent.change(screen.getByPlaceholderText('Your Full Name *'), {
    target: { value: 'Jordan' },
  });
  fireEvent.change(screen.getByPlaceholderText('Phone Number *'), { target: { value: '123' } });
  fireEvent.change(screen.getByPlaceholderText('Email Address *'), {
    target: { value: 'jordan@example.com' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'paid-ads' } });
  fireEvent.change(screen.getByPlaceholderText(/Tell us about your project/), {
    target: { value: 'Launch' },
  });
};

it('appears after the delay and remains dismissed after closing', async () => {
  render(<LeadPopup />);
  expect(screen.queryByText('Free Consultation')).not.toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(3500);
  });
  await waitFor(() => expect(screen.getByText('Free Consultation')).toBeInTheDocument());
  fireEvent.click(screen.getAllByRole('button')[0]);
  expect(screen.queryByText('Free Consultation')).not.toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(3500);
  });
  expect(screen.queryByText('Free Consultation')).not.toBeInTheDocument();
});

it('closes from the backdrop and stores private leads with confirmation timeout', async () => {
  await showPopup();
  fillPopup();
  fireEvent.click(screen.getByRole('button', { name: /Book My Free/ }));
  expect(JSON.parse(localStorage.getItem('creativva_leads') || '[]')[0]).toMatchObject({
    name: 'Jordan',
    service: 'paid-ads',
    hideDetails: true,
  });
  expect(screen.getByText("We'll be in touch!")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(2500);
  });
  await waitFor(() => expect(screen.queryByText("We'll be in touch!")).not.toBeInTheDocument());
});

it('dismisses when the backdrop is clicked', async () => {
  await showPopup();
  const backdrop = document.querySelector('.absolute.inset-0.bg-black\\/70');
  expect(backdrop).toBeTruthy();
  fireEvent.click(backdrop!);
  expect(screen.queryByText('Free Consultation')).not.toBeInTheDocument();
});
