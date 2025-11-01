import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordCell } from './WordCell';

describe('WordCell', () => {
  it('should render the word text', () => {
    render(<WordCell word="Apple" isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should apply selected class when isSelected is true', () => {
    render(<WordCell word="Apple" isSelected={true} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('selected');
  });

  it('should not apply selected class when isSelected is false', () => {
    render(<WordCell word="Apple" isSelected={false} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('selected');
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<WordCell word="Apple" isSelected={false} onClick={handleClick} />);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<WordCell word="Apple" isSelected={false} onClick={() => {}} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled and clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<WordCell word="Apple" isSelected={false} onClick={handleClick} disabled={true} />);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply disabled class when disabled', () => {
    render(<WordCell word="Apple" isSelected={false} onClick={() => {}} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled');
  });
});
