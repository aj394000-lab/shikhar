import { act, render, screen } from '@testing-library/react';
import CarIntro from './CarIntro';

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('renders the intro screen and transitions through fading to gone', () => {
  render(<CarIntro />);

  expect(screen.getByAltText(/Creativva logo/)).toBeInTheDocument();
  expect(screen.getByText('Digital Marketing Agency')).toBeInTheDocument();
  expect(screen.getByText('Creativity')).toBeInTheDocument();
  expect(screen.getByText('Results.')).toBeInTheDocument();
  expect(document.querySelector('.animated-gradient-bg')).toHaveClass('opacity-100');

  act(() => {
    jest.advanceTimersByTime(3200);
  });
  expect(document.querySelector('.animated-gradient-bg')).toHaveClass('opacity-0');
  expect(document.querySelector('.animated-gradient-bg')).toHaveClass('pointer-events-none');

  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(document.querySelector('.animated-gradient-bg')).not.toBeInTheDocument();
});

it('cleans up both phase timers when unmounted', () => {
  const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
  const { unmount } = render(<CarIntro />);

  unmount();

  expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  clearTimeoutSpy.mockRestore();
});
