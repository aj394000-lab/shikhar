import { fireEvent, render, screen } from '@testing-library/react';
import NotFound from './not-found';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

it('navigates home and back from the not-found page', () => {
  const back = jest.spyOn(window.history, 'back').mockImplementation(() => {});
  render(<NotFound />);
  fireEvent.click(screen.getByRole('button', { name: /Go Back/ }));
  expect(back).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Back to Home/ }));
  expect(push).toHaveBeenCalledWith('/');
});
