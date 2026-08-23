import { fireEvent, render, screen } from '@testing-library/react';
import AppIcon from './AppIcon';

it('resolves outline and solid heroicons by name', () => {
  const { rerender } = render(<AppIcon name="HeartIcon" aria-label="heart" />);
  expect(screen.getByLabelText('heart').tagName).toBe('svg');
  rerender(<AppIcon name="HeartIcon" variant="solid" aria-label="solid heart" />);
  expect(screen.getByLabelText('solid heart').tagName).toBe('svg');
});

it('falls back to the question-mark icon for unknown names', () => {
  render(<AppIcon name="NotARealIcon" aria-label="fallback" />);
  expect(screen.getByLabelText('fallback')).toBeInTheDocument();
});

it('applies disabled styles and suppresses clicks', () => {
  const onClick = jest.fn();
  render(<AppIcon name="CheckIcon" disabled onClick={onClick} aria-label="check" />);
  const icon = screen.getByLabelText('check');
  expect(icon).toHaveClass('opacity-50', 'cursor-not-allowed');
  fireEvent.click(icon);
  expect(onClick).not.toHaveBeenCalled();
});

it('adds pointer styling and calls enabled handlers', () => {
  const onClick = jest.fn();
  render(<AppIcon name="CheckIcon" onClick={onClick} aria-label="check" />);
  const icon = screen.getByLabelText('check');
  expect(icon).toHaveClass('cursor-pointer');
  fireEvent.click(icon);
  expect(onClick).toHaveBeenCalledTimes(1);
});
