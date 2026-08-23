import { fireEvent, render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img data-testid="hero-image" alt={props.alt} />,
}));

it('renders the hero content, statistics, particles, and calls to action', () => {
  render(<HeroSection />);

  expect(document.querySelector('#hero')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Embark On The' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Journey Of Luxury' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '– Your Dream Car' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Awaits.' })).toBeInTheDocument();
  expect(screen.getByText('Creativva Studio')).toBeInTheDocument();
  expect(screen.getByText('Premium')).toBeInTheDocument();
  expect(screen.getByText('V8')).toBeInTheDocument();
  expect(screen.getByText('150+')).toBeInTheDocument();
  expect(screen.getByText('Projects Delivered')).toBeInTheDocument();
  expect(screen.getByText('50+')).toBeInTheDocument();
  expect(screen.getByText('Happy Clients')).toBeInTheDocument();
  expect(screen.getByText('3×')).toBeInTheDocument();
  expect(screen.getByText('Average ROI')).toBeInTheDocument();
  expect(screen.getByText('Scroll')).toBeInTheDocument();
  expect(screen.getByTestId('hero-image')).toHaveAttribute(
    'alt',
    expect.stringContaining('luxury')
  );
  expect(document.querySelectorAll('.particle')).toHaveLength(7);

  expect(screen.getByRole('link', { name: /Start Your Journey/ })).toHaveAttribute(
    'href',
    '#contact'
  );
  expect(screen.getByRole('link', { name: /View Our Work/ })).toHaveAttribute('href', '#portfolio');
});

it('updates the parallax image on mouse movement and cleans up the listener', () => {
  const animationFrame = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback) => {
      callback(0);
      return 1;
    });
  const removeListener = jest.spyOn(window, 'removeEventListener');
  const { unmount } = render(<HeroSection />);

  fireEvent.mouseMove(window, { clientX: window.innerWidth, clientY: 0 });

  expect(screen.getByTestId('hero-image').parentElement).toHaveStyle(
    'transform: scale(1.06) translate(-10px, 5px)'
  );
  expect(animationFrame).toHaveBeenCalledTimes(1);

  unmount();

  expect(removeListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  animationFrame.mockRestore();
  removeListener.mockRestore();
});
