import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryRow } from './CategoryRow';
import { Category } from '../types';

describe('CategoryRow', () => {
  const mockCategory: Category = {
    name: 'Farm Animals',
    words: ['Cow', 'Pig', 'Sheep', 'Horse'],
    difficulty: 1,
  };

  it('should render the category name in uppercase', () => {
    render(<CategoryRow category={mockCategory} />);
    expect(screen.getByText('FARM ANIMALS')).toBeInTheDocument();
  });

  it('should render all words separated by commas', () => {
    render(<CategoryRow category={mockCategory} />);
    expect(screen.getByText('Cow, Pig, Sheep, Horse')).toBeInTheDocument();
  });

  it('should apply correct background color for difficulty 1', () => {
    render(<CategoryRow category={mockCategory} />);
    const row = screen.getByText('FARM ANIMALS').closest('.category-row');
    expect(row).toHaveStyle({ backgroundColor: '#f9df6d' });
  });

  it('should apply correct background color for difficulty 2', () => {
    const category: Category = { ...mockCategory, difficulty: 2 };
    render(<CategoryRow category={category} />);
    const row = screen.getByText('FARM ANIMALS').closest('.category-row');
    expect(row).toHaveStyle({ backgroundColor: '#a0c35a' });
  });

  it('should apply correct background color for difficulty 3', () => {
    const category: Category = { ...mockCategory, difficulty: 3 };
    render(<CategoryRow category={category} />);
    const row = screen.getByText('FARM ANIMALS').closest('.category-row');
    expect(row).toHaveStyle({ backgroundColor: '#b0c4ef' });
  });

  it('should apply correct background color for difficulty 4', () => {
    const category: Category = { ...mockCategory, difficulty: 4 };
    render(<CategoryRow category={category} />);
    const row = screen.getByText('FARM ANIMALS').closest('.category-row');
    expect(row).toHaveStyle({ backgroundColor: '#ba81c5' });
  });

  it('should handle category with different words', () => {
    const category: Category = {
      name: 'Colors',
      words: ['Red', 'Blue', 'Green', 'Yellow'],
      difficulty: 2,
    };
    render(<CategoryRow category={category} />);
    expect(screen.getByText('COLORS')).toBeInTheDocument();
    expect(screen.getByText('Red, Blue, Green, Yellow')).toBeInTheDocument();
  });
});
