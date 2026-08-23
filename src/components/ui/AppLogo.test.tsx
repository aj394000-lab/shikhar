import { fireEvent, render, screen } from '@testing-library/react';
import AppLogo from './AppLogo';

jest.mock('./AppImage', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { priority, unoptimized, ...rest } = props;
    return (
      <img
        alt={String(props.alt)}
        {...rest}
        data-priority={String(priority)}
        data-unoptimized={String(unoptimized)}
      />
    );
  },
}));

it('renders an image logo by default and marks SVG sources unoptimized', () => {
  render(<AppLogo src="/logo.svg" size={32} />);
  const image = screen.getByAltText('Logo');
  expect(image).toHaveAttribute('src', '/logo.svg');
  expect(image).toHaveAttribute('data-unoptimized', 'true');
});

it('renders the icon branch without an image and supports clicks', () => {
  const onClick = jest.fn();
  render(<AppLogo src="" iconName="CheckIcon" size={20} onClick={onClick} />);
  expect(screen.queryByAltText('Logo')).not.toBeInTheDocument();
  const icon = document.querySelector('svg');
  expect(icon).toBeInTheDocument();
  expect(icon?.parentElement).toHaveClass('cursor-pointer');
  fireEvent.click(icon!);
  expect(onClick).toHaveBeenCalledTimes(1);
});
