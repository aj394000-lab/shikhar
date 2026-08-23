import { fireEvent, render, screen } from '@testing-library/react';
import AppImage from './AppImage';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, priority, unoptimized, ...rest } = props;
    return (
      <img
        {...rest}
        data-fill={String(fill)}
        data-priority={String(priority)}
        data-unoptimized={String(unoptimized)}
      />
    );
  },
}));

it('renders defaults and swaps to the fallback only once on error', () => {
  render(<AppImage src="/photo.png" alt="photo" fallbackSrc="/fallback.png" />);
  const image = screen.getByAltText('photo');
  expect(image).toHaveAttribute('src', '/photo.png');
  expect(image).toHaveAttribute('width', '400');
  fireEvent.error(image);
  expect(image).toHaveAttribute('src', '/fallback.png');
  fireEvent.error(image);
  expect(image).toHaveAttribute('src', '/fallback.png');
});

it('wraps fill images, preserves priority over loading, and adds click classes', () => {
  const onClick = jest.fn();
  render(
    <AppImage
      src="https://example.com/photo.png"
      alt="fill photo"
      fill
      priority
      loading="lazy"
      sizes="100vw"
      onClick={onClick}
    />
  );
  const image = screen.getByAltText('fill photo');
  expect(image.parentElement).toHaveClass('relative');
  expect(image).toHaveAttribute('data-fill', 'true');
  expect(image).toHaveAttribute('data-priority', 'true');
  expect(image).not.toHaveAttribute('loading', 'lazy');
  expect(image).toHaveClass('cursor-pointer');
  fireEvent.click(image);
  expect(onClick).toHaveBeenCalled();
});

it('uses loading when not prioritized', () => {
  render(<AppImage src="/photo.png" alt="lazy photo" loading="eager" />);
  expect(screen.getByAltText('lazy photo')).toHaveAttribute('loading', 'eager');
});
