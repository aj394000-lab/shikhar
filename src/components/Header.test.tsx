import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

it('renders navigation links and updates the scrolled state', () => {
  render(<Header />);
  expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services');
  expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
  const header = screen.getByRole('banner');
  expect(header).toHaveClass('bg-transparent');
  window.scrollY = 41;
  fireEvent.scroll(window);
  expect(header).toHaveClass('glass-nav');
});

it('opens and closes the mobile menu via links and scrolling', () => {
  render(<Header />);
  const toggle = screen.getByRole('button', { name: 'Open menu' });
  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  const mobileServices = screen.getAllByRole('link', { name: 'Services' })[1];
  fireEvent.click(mobileServices);
  expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  fireEvent.scroll(window);
  expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
});
