import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CelebrationOverlay } from './CelebrationOverlay';

describe('CelebrationOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render nothing when show is false', () => {
    const { container } = render(
      <CelebrationOverlay show={false} onComplete={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render overlay when show is true', () => {
    render(<CelebrationOverlay show={true} onComplete={() => {}} />);
    const overlay = document.querySelector('.celebration-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should render all three celebration GIFs', () => {
    render(<CelebrationOverlay show={true} onComplete={() => {}} />);

    const fireworks = screen.getByAltText('Fireworks');
    const balloons = screen.getByAltText('Balloons');
    const confetti = screen.getByAltText('Confetti');

    expect(fireworks).toBeInTheDocument();
    expect(balloons).toBeInTheDocument();
    expect(confetti).toBeInTheDocument();
  });

  it('should have correct GIF sources from Giphy', () => {
    render(<CelebrationOverlay show={true} onComplete={() => {}} />);

    const fireworks = screen.getByAltText('Fireworks') as HTMLImageElement;
    const balloons = screen.getByAltText('Balloons') as HTMLImageElement;
    const confetti = screen.getByAltText('Confetti') as HTMLImageElement;

    expect(fireworks.src).toContain('giphy.com');
    expect(balloons.src).toContain('giphy.com');
    expect(confetti.src).toContain('giphy.com');
  });

  it('should call onComplete after 6 seconds', () => {
    const onComplete = vi.fn();
    render(<CelebrationOverlay show={true} onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    // Fast-forward time by 5 seconds (not enough)
    vi.advanceTimersByTime(5000);
    expect(onComplete).not.toHaveBeenCalled();

    // Fast-forward time by 1 more second (total 6 seconds)
    vi.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should not call onComplete when show is false', () => {
    const onComplete = vi.fn();
    render(<CelebrationOverlay show={false} onComplete={onComplete} />);

    vi.advanceTimersByTime(10000);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should clean up timer on unmount', () => {
    const onComplete = vi.fn();
    const { unmount } = render(
      <CelebrationOverlay show={true} onComplete={onComplete} />
    );

    // Unmount before timer completes
    unmount();
    vi.advanceTimersByTime(6000);

    // onComplete should not be called after unmount
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should have correct CSS classes for animations', () => {
    render(<CelebrationOverlay show={true} onComplete={() => {}} />);

    const fireworksDiv = document.querySelector('.celebration-fireworks');
    const balloonsDiv = document.querySelector('.celebration-balloons');
    const confettiDiv = document.querySelector('.celebration-confetti');

    expect(fireworksDiv).toHaveClass('celebration-gif', 'celebration-fireworks');
    expect(balloonsDiv).toHaveClass('celebration-gif', 'celebration-balloons');
    expect(confettiDiv).toHaveClass('celebration-gif', 'celebration-confetti');
  });
});
