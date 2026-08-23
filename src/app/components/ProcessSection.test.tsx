import { fireEvent, render, screen } from '@testing-library/react';
import ProcessSection from './ProcessSection';

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

it('renders all process steps and differentiators', () => {
  render(<ProcessSection />);

  expect(document.querySelector('#process')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Why Creativva/ })).toBeInTheDocument();
  ['Understand', 'Strategize', 'Create', 'Grow'].forEach((title) => {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });
  ['Creative Approach', 'Data-Driven', 'Transparent Process', 'Dedicated Support'].forEach(
    (title) => expect(screen.getByText(title)).toBeInTheDocument()
  );
  expect(screen.getAllByText(/Step 0/)).toHaveLength(4);
  expect(observeMock).toHaveBeenCalledTimes(4);
});

it('reveals steps, handles hover styles, and disconnects on unmount', () => {
  const { container, unmount } = render(<ProcessSection />);
  const firstCard = observedCards[0] as HTMLElement;
  const icon = firstCard.querySelector('.w-14.h-14') as HTMLElement;
  const differentiator = screen.getByText('Creative Approach').parentElement
    ?.parentElement as HTMLElement;

  observerCallback(
    observedCards.map((target) => ({ isIntersecting: true, target }) as IntersectionObserverEntry),
    {} as IntersectionObserver
  );
  expect(firstCard).toHaveClass('animate-slide-up');
  expect(firstCard).toHaveStyle({ opacity: '1' });

  fireEvent.mouseEnter(icon);
  expect(icon).toHaveStyle('box-shadow: 0 0 20px rgba(155,79,228,0.4)');
  fireEvent.mouseLeave(icon);
  expect(icon).toHaveStyle('box-shadow: 0 0 0 0 rgba(155,79,228,0.4)');

  fireEvent.mouseEnter(differentiator);
  expect(differentiator).toHaveStyle({
    borderColor: 'rgba(139,63,212,0.35)',
    background: 'rgba(139,63,212,0.06)',
  });
  fireEvent.mouseLeave(differentiator);
  expect(differentiator).toHaveStyle({
    borderColor: 'rgba(30,32,64,0.8)',
    background: 'rgba(13,14,31,0.6)',
  });

  expect(container.querySelectorAll('.shimmer-card')).toHaveLength(4);
  unmount();
  expect(disconnectMock).toHaveBeenCalledTimes(1);
});
