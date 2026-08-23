import { fireEvent, render, screen } from '@testing-library/react';
import PortfolioSection from './PortfolioSection';

const observedTitle: Element[] = [];
let observerCallback: IntersectionObserverCallback;
const observeMock = jest.fn((target: Element) => observedTitle.push(target));
const disconnectMock = jest.fn();

jest.mock('@/components/ui/AppImage', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props;
    return <img {...rest} alt={String(props.alt ?? '')} />;
  },
}));

beforeEach(() => {
  observedTitle.length = 0;
  observeMock.mockClear();
  disconnectMock.mockClear();
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

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders every portfolio card, category, and CTA link', () => {
  render(<PortfolioSection />);

  expect(document.querySelector('#portfolio')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Car Portfolio/ })).toBeInTheDocument();
  expect(screen.getByText('Our Work')).toBeInTheDocument();
  [
    'Supercar Cinematic Reel',
    'Toyota Fortuner Adventure shoot',
    'Electric Sports Motion',
    'Dealership Meta Ad Campaign',
    'Brand Identity Reveal',
  ].forEach((title) => expect(screen.getByRole('heading', { name: title })).toBeInTheDocument());
  [
    'Video Editing',
    'Automotive Lifestyle',
    'Creative Direction',
    'Paid Advertising',
    'Brand Strategy',
  ].forEach((category) => expect(screen.getByText(category)).toBeInTheDocument());
  expect(screen.getAllByRole('link')).toHaveLength(7);
  screen
    .getAllByRole('link')
    .forEach((link) => expect(link).toHaveAttribute('href', expect.any(String)));
  expect(screen.getAllByRole('link', { name: /Instagram/ })).toHaveLength(5);
  expect(screen.getByRole('link', { name: 'Commission a Shoot' })).toHaveAttribute(
    'href',
    '#contact'
  );
  expect(screen.getByRole('link', { name: /View complete portfolio/ })).toHaveAttribute(
    'href',
    '#contact'
  );
  expect(screen.getByText('Featured Work')).toBeInTheDocument();
});

it('handles card hover, header CTA hover, reveal, and observer cleanup', () => {
  const { unmount } = render(<PortfolioSection />);
  const card = screen.getByRole('link', { name: 'View Supercar Cinematic Reel on Instagram' });
  const image = card.querySelector('img') as HTMLImageElement;
  const commission = screen.getByRole('link', { name: 'Commission a Shoot' });

  fireEvent.mouseEnter(card);
  expect(card).toHaveStyle('transform: translateY(-4px)');
  expect(image).toHaveClass('hovered');
  fireEvent.mouseLeave(card);
  expect(card).toHaveStyle('transform: translateY(0)');
  expect(image).not.toHaveClass('hovered');

  fireEvent.mouseEnter(commission);
  expect(commission).toHaveStyle({ borderColor: 'rgba(139,63,212,0.5)', color: '#C47AFF' });
  fireEvent.mouseLeave(commission);
  expect(commission).toHaveStyle({ borderColor: 'rgba(30,32,64,0.9)', color: '#F0F0F5' });

  const title = screen.getByText('Our Work').parentElement?.parentElement as HTMLElement;
  observerCallback(
    [{ isIntersecting: false, target: title } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
  expect(title).not.toHaveClass('animate-slide-up');
  observerCallback(
    [{ isIntersecting: true, target: title } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
  expect(title).toHaveClass('animate-slide-up');
  expect(title).toHaveStyle({ opacity: '1' });

  unmount();
  expect(disconnectMock).toHaveBeenCalledTimes(1);
});
