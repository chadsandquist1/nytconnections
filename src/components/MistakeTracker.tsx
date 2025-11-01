import React from 'react';

interface MistakeTrackerProps {
  mistakes: number;
  maxMistakes: number;
}

export const MistakeTracker: React.FC<MistakeTrackerProps> = ({ mistakes, maxMistakes }) => {
  const remaining = maxMistakes - mistakes;

  return (
    <div className="mistake-tracker">
      <span>Mistakes remaining: </span>
      <div className="mistake-dots">
        {Array.from({ length: maxMistakes }).map((_, index) => (
          <div
            key={index}
            className={`mistake-dot ${index < remaining ? 'remaining' : 'used'}`}
          />
        ))}
      </div>
    </div>
  );
};
