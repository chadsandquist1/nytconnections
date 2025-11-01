import React from 'react';

interface GameControlsProps {
  onShuffle: () => void;
  onDeselect: () => void;
  onSubmit: () => void;
  selectedCount: number;
  disabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onShuffle,
  onDeselect,
  onSubmit,
  selectedCount,
  disabled,
}) => {
  return (
    <div className="game-controls">
      <button className="control-btn" onClick={onShuffle} disabled={disabled}>
        Shuffle
      </button>
      <button
        className="control-btn"
        onClick={onDeselect}
        disabled={disabled || selectedCount === 0}
      >
        Deselect All
      </button>
      <button
        className="control-btn submit-btn"
        onClick={onSubmit}
        disabled={disabled || selectedCount !== 4}
      >
        Submit
      </button>
    </div>
  );
};
