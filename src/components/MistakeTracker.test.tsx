import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MistakeTracker } from './MistakeTracker';

describe('MistakeTracker', () => {
  it('should display mistakes remaining text', () => {
    render(<MistakeTracker mistakes={0} maxMistakes={4} />);
    expect(screen.getByText('Mistakes remaining:')).toBeInTheDocument();
  });

  it('should render correct number of mistake dots', () => {
    const { container } = render(<MistakeTracker mistakes={0} maxMistakes={4} />);
    const dots = container.querySelectorAll('.mistake-dot');
    expect(dots).toHaveLength(4);
  });

  it('should show all dots as remaining when no mistakes', () => {
    const { container } = render(<MistakeTracker mistakes={0} maxMistakes={4} />);
    const remainingDots = container.querySelectorAll('.mistake-dot.remaining');
    const usedDots = container.querySelectorAll('.mistake-dot.used');
    expect(remainingDots).toHaveLength(4);
    expect(usedDots).toHaveLength(0);
  });

  it('should show correct remaining dots after 1 mistake', () => {
    const { container } = render(<MistakeTracker mistakes={1} maxMistakes={4} />);
    const remainingDots = container.querySelectorAll('.mistake-dot.remaining');
    const usedDots = container.querySelectorAll('.mistake-dot.used');
    expect(remainingDots).toHaveLength(3);
    expect(usedDots).toHaveLength(1);
  });

  it('should show correct remaining dots after 2 mistakes', () => {
    const { container } = render(<MistakeTracker mistakes={2} maxMistakes={4} />);
    const remainingDots = container.querySelectorAll('.mistake-dot.remaining');
    const usedDots = container.querySelectorAll('.mistake-dot.used');
    expect(remainingDots).toHaveLength(2);
    expect(usedDots).toHaveLength(2);
  });

  it('should show no remaining dots when all mistakes used', () => {
    const { container } = render(<MistakeTracker mistakes={4} maxMistakes={4} />);
    const remainingDots = container.querySelectorAll('.mistake-dot.remaining');
    const usedDots = container.querySelectorAll('.mistake-dot.used');
    expect(remainingDots).toHaveLength(0);
    expect(usedDots).toHaveLength(4);
  });

  it('should handle different maxMistakes value', () => {
    const { container } = render(<MistakeTracker mistakes={2} maxMistakes={5} />);
    const dots = container.querySelectorAll('.mistake-dot');
    const remainingDots = container.querySelectorAll('.mistake-dot.remaining');
    expect(dots).toHaveLength(5);
    expect(remainingDots).toHaveLength(3);
  });
});
