import React from "react";
import "./Tracker.css";

const Tracker = ({
  hintCount,
  setHintCount,
  setHintsUsed,
  wordsFound,
  setShowHint,
  setShowCompletionPopup,
  setStr,
  config,
  onRestartGame,
  onBackToMenu,
}) => {
  const gameConfig = config?.ui?.game || {};
  const totalWords = gameConfig.totalWords || 8;

  return (
    <div className="tracker-container">
      <div className="navigation-buttons">
        <button onClick={onBackToMenu} className="nav-button back-to-menu">
          ← Back to Menu
        </button>
        <button onClick={onRestartGame} className="nav-button restart-game">
          ↻ Restart Game
        </button>
      </div>
      <div className="theme-card">
        <div className="theme-header">
          <h2>{gameConfig.themeLabel || "TODAY'S THEME"}</h2>
        </div>
        <div className="theme-content">
          <p>{gameConfig.themeText || "Deviled eggs anyone?"}</p>
        </div>
      </div>
      <div className="tracker-controls">
        <div className="words-found">
          <h1>
            <strong>{wordsFound}</strong> of <strong>{totalWords}</strong> {gameConfig.wordsFoundLabel || "theme words found"}.
          </h1>
        </div>
        <div className="hint-button-container">
          <button
            onClick={() => {
              if (wordsFound === totalWords) {
                setShowCompletionPopup(true);
              } else {
                setHintCount(hintCount - 3);
                setHintsUsed((hintsUsed) => hintsUsed + 1);
                setStr((prevStr) => prevStr + "💡");
                setShowHint(true);
              }
            }}
            disabled={hintCount < 3 && wordsFound < totalWords}
            className={`hint-button ${
              wordsFound === totalWords
                ? "completed"
                : hintCount < 3
                  ? "disabled"
                  : ""
            }`}
            style={{
              backgroundImage:
                wordsFound !== totalWords
                  ? `linear-gradient(to right, #000000 ${(hintCount / 3) * 100}%, #ffffff ${(hintCount / 3) * 100}%)`
                  : undefined,
            }}
          >
            {wordsFound === totalWords ? (gameConfig.viewResultsText || "View Results") : (gameConfig.hintButtonText || "Hint")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
