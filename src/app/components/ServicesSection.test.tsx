import { render, screen } from '@testing-library/react';
import ServicesSection from './ServicesSection';

const observedCards: Element[] = [];
let observerCallback: IntersectionObserverCallback;
const observeMock = jest.fn((card: Element) => observedCards.push(card));
const disconnectMock = jest.fn();

beforeEach(() => {
  observedCards.length = 0;
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

it('renders every service card and its section heading', () => {
  render(<ServicesSection />);

  expect(document.querySelector('#services')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Our Services/ })).toBeInTheDocument();
  expect(screen.getByText('What We Do')).toBeInTheDocument();

  [
    'Social Media Marketing',
    'Content Creation',
    'Paid Advertising',
    'SEO & Analytics',
    'Social Media Management',
    'Brand Identity & Strategy',
    'Performance Marketing',
    'Video Editing',
  ].forEach((title) => expect(screen.getByRole('heading', { name: title })).toBeInTheDocument());
  expect(document.querySelectorAll('.shimmer-card')).toHaveLength(8);
  expect(screen.getByText(/We don.t just run campaigns/)).toBeInTheDocument();
});

it('reveals observed cards when they intersect and disconnects on unmount', () => {
  const { unmount } = render(<ServicesSection />);
  expect(observeMock).toHaveBeenCalledTimes(8);

  observerCallback(
    observedCards.map((target) => ({ isIntersecting: false, target }) as IntersectionObserverEntry),
    {} as IntersectionObserver
  );
  observedCards.forEach((card) => {
    expect(card).not.toHaveClass('animate-slide-up');
    expect(card).toHaveStyle({ opacity: '0' });
  });

  observerCallback(
    observedCards.map((target) => ({ isIntersecting: true, target }) as IntersectionObserverEntry),
    {} as IntersectionObserver
  );
  observedCards.forEach((card) => {
    expect(card).toHaveClass('animate-slide-up');
    expect(card).toHaveStyle({ opacity: '1' });
  });

  unmount();
  expect(disconnectMock).toHaveBeenCalledTimes(1);
});
