import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameControls } from './GameControls';

describe('GameControls', () => {
  it('should render all three buttons', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={0}
        disabled={false}
      />
    );

    expect(screen.getByText('Shuffle')).toBeInTheDocument();
    expect(screen.getByText('Deselect All')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should call onShuffle when shuffle button is clicked', async () => {
    const handleShuffle = vi.fn();
    const user = userEvent.setup();

    render(
      <GameControls
        onShuffle={handleShuffle}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={0}
        disabled={false}
      />
    );

    await user.click(screen.getByText('Shuffle'));
    expect(handleShuffle).toHaveBeenCalledTimes(1);
  });

  it('should call onDeselect when deselect button is clicked', async () => {
    const handleDeselect = vi.fn();
    const user = userEvent.setup();

    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={handleDeselect}
        onSubmit={() => {}}
        selectedCount={2}
        disabled={false}
      />
    );

    await user.click(screen.getByText('Deselect All'));
    expect(handleDeselect).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when submit button is clicked', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={handleSubmit}
        selectedCount={4}
        disabled={false}
      />
    );

    await user.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={4}
        disabled={true}
      />
    );

    expect(screen.getByText('Shuffle')).toBeDisabled();
    expect(screen.getByText('Deselect All')).toBeDisabled();
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('should disable deselect button when selectedCount is 0', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={0}
        disabled={false}
      />
    );

    expect(screen.getByText('Deselect All')).toBeDisabled();
  });

  it('should disable submit button when selectedCount is not 4', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={3}
        disabled={false}
      />
    );

    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('should enable submit button when selectedCount is exactly 4', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={4}
        disabled={false}
      />
    );

    expect(screen.getByText('Submit')).not.toBeDisabled();
  });

  it('should enable deselect button when there are selections', () => {
    render(
      <GameControls
        onShuffle={() => {}}
        onDeselect={() => {}}
        onSubmit={() => {}}
        selectedCount={2}
        disabled={false}
      />
    );

    expect(screen.getByText('Deselect All')).not.toBeDisabled();
  });
});
