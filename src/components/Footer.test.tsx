import { fireEvent, render, screen } from '@testing-library/react';
import Footer from './Footer';

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

it('renders footer navigation and social destinations', () => {
  render(<Footer />);
  expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services');
  expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
  expect(screen.getByRole('link', { name: 'Process' })).toHaveAttribute('href', '#process');
  expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/cre.ativva'
  );
  expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:creativvalab@gmail.com'
  );
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '#');
  expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '#');
  expect(screen.getAllByText('© 2026 Creativva. All rights reserved.')).toHaveLength(2);
});

it('applies and removes hover styles for both social links', () => {
  render(<Footer />);
  const instagram = screen.getByRole('link', { name: 'Instagram' });
  const email = screen.getByRole('link', { name: 'Email' });

  fireEvent.mouseEnter(instagram);
  expect(instagram).toHaveStyle({
    borderColor: 'rgba(139,63,212,0.6)',
    color: '#C47AFF',
    boxShadow: '0 0 12px rgba(139,63,212,0.3)',
  });
  fireEvent.mouseLeave(instagram);
  expect(instagram).toHaveStyle({
    borderColor: 'rgba(30,32,64,0.9)',
    color: 'rgba(138,139,168,0.7)',
    boxShadow: 'none',
  });

  fireEvent.mouseEnter(email);
  expect(email).toHaveStyle({
    borderColor: 'rgba(255,107,26,0.6)',
    color: '#FF8C4A',
    boxShadow: '0 0 12px rgba(255,107,26,0.3)',
  });
  fireEvent.mouseLeave(email);
  expect(email).toHaveStyle({
    borderColor: 'rgba(30,32,64,0.9)',
    color: 'rgba(138,139,168,0.7)',
    boxShadow: 'none',
  });
});
