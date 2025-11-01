import React from 'react';

interface WordCellProps {
  word: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const WordCell: React.FC<WordCellProps> = ({ word, isSelected, onClick, disabled = false }) => {
  return (
    <button
      className={`word-cell ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {word}
    </button>
  );
};
