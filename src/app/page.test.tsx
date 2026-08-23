import { render, screen } from '@testing-library/react';
import HomePage from './page';

jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="page-header" />,
}));
jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="page-footer" />,
}));
jest.mock('@/app/components/HeroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="page-hero" />,
}));
jest.mock('@/app/components/ServicesSection', () => ({
  __esModule: true,
  default: () => <div data-testid="page-services" />,
}));
jest.mock('@/app/components/PortfolioSection', () => ({
  __esModule: true,
  default: () => <div data-testid="page-portfolio" />,
}));
jest.mock('@/app/components/ProcessSection', () => ({
  __esModule: true,
  default: () => <div data-testid="page-process" />,
}));
jest.mock('@/app/components/ContactSection', () => ({
  __esModule: true,
  default: () => <div data-testid="page-contact" />,
}));
jest.mock('@/app/components/LeadPopup', () => ({
  __esModule: true,
  default: () => <div data-testid="page-lead-popup" />,
}));

it('composes the homepage with navigation, popup, sections, and footer', () => {
  render(<HomePage />);

  expect(screen.getByRole('main')).toBeInTheDocument();
  [
    'page-lead-popup',
    'page-header',
    'page-hero',
    'page-services',
    'page-portfolio',
    'page-process',
    'page-contact',
    'page-footer',
  ].forEach((testId) => expect(screen.getByTestId(testId)).toBeInTheDocument());
});
