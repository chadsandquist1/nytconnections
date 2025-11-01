import React from 'react';
import { Category, DIFFICULTY_COLORS } from '../types';

interface CategoryRowProps {
  category: Category;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ category }) => {
  const backgroundColor = DIFFICULTY_COLORS[category.difficulty as keyof typeof DIFFICULTY_COLORS] || '#ccc';

  return (
    <div className="category-row" style={{ backgroundColor }}>
      <div className="category-name">{category.name.toUpperCase()}</div>
      <div className="category-words">{category.words.join(', ')}</div>
    </div>
  );
};
