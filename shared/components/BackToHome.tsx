import React from 'react';
import './BackToHome.css';

export interface BackToHomeProps {
  showBackButton?: boolean;
  showRestartButton?: boolean;
  backLabel?: string;
  restartLabel?: string;
  onBack?: () => void;
  onRestart?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom';
}

export const BackToHome: React.FC<BackToHomeProps> = ({
  showBackButton = true,
  showRestartButton = false,
  backLabel = '← Back to Menu',
  restartLabel = '↻ Restart',
  onBack,
  onRestart,
  position = 'top-left',
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      window.location.reload();
    }
  };

  if (!showBackButton && !showRestartButton) {
    return null;
  }

  return (
    <div className={`back-to-home back-to-home--${position}`}>
      {showBackButton && (
        <button className="back-to-home__button" onClick={handleBack}>
          {backLabel}
        </button>
      )}
      {showRestartButton && (
        <button className="back-to-home__button" onClick={handleRestart}>
          {restartLabel}
        </button>
      )}
    </div>
  );
};

export default BackToHome;
