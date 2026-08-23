import { render, screen } from '@testing-library/react';
import Footer from './Footer';

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

it('renders footer navigation and social destinations', () => {
  render(<Footer />);
  expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services');
  expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
  expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/cre.ativva'
  );
  expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:creativvalab@gmail.com'
  );
});
