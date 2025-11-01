import React, { useEffect } from 'react';

interface CelebrationOverlayProps {
  show: boolean;
  onComplete: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-gif celebration-fireworks">
        <img
          src="https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif"
          alt="Fireworks"
        />
      </div>
      <div className="celebration-gif celebration-balloons">
        <img
          src="https://media.giphy.com/media/g5R9dok94mrIvplmZd/giphy.gif"
          alt="Balloons"
        />
      </div>
      <div className="celebration-gif celebration-confetti">
        <img
          src="https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
          alt="Confetti"
        />
      </div>
    </div>
  );
};
