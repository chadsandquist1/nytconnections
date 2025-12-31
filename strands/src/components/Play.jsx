import React, { useState, useEffect } from "react";
import LetterGrid from "./LetterGrid";
import Tracker from "./Tracker";
import CelebrationOverlay from "./CelebrationOverlay";
import "./Play.css";

const Play = ({ config, gameData, onRestartGame, onBackToMenu }) => {
  const [hintCount, setHintCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wordsFound, setWordsFound] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [str, setStr] = useState("");

  const completionConfig = config?.ui?.completion || {};
  const gameConfig = config?.ui?.game || {};
  const totalWords = gameConfig.totalWords || 8;

  const timer = (seconds, callback) => {
    setTimeout(callback, seconds * 1000);
  };

  useEffect(() => {
    if (wordsFound === totalWords) {
      timer(1, () => {
        // Show celebration overlay first
        setShowCelebration(true);
      });
    }
  }, [wordsFound, totalWords]);

  const handleCelebrationComplete = () => {
    // After celebration is done (6 seconds), show completion popup
    setShowCelebration(false);
    setShowCompletionPopup(true);
  };

  const characters = Array.from(str);
  const strEdited = characters.reduce((acc, curr, index) => {
    acc.push(curr);
    if ((index + 1) % 4 === 0 && index + 1 !== characters.length) {
      acc.push(<br key={index} />);
    }
    return acc;
  }, []);

  const completionMessage = (completionConfig.messageTemplate || 'Nice job finding the theme words 🔵 and <br />Spangram 🟡. You used {hintsUsed} hints 💡.')
    .replace('{hintsUsed}', hintsUsed);

  return (
    <div className="play-container">
      <div className="play-grid">
        <div className="tracker-column">
          <Tracker
            hintCount={hintCount}
            setHintCount={setHintCount}
            setHintsUsed={setHintsUsed}
            wordsFound={wordsFound}
            setShowHint={setShowHint}
            setShowCompletionPopup={setShowCompletionPopup}
            setStr={setStr}
            config={config}
            onRestartGame={onRestartGame}
            onBackToMenu={onBackToMenu}
          />
        </div>
        <div className="grid-column">
          <LetterGrid
            setHintCount={setHintCount}
            setWordsFound={setWordsFound}
            showHint={showHint}
            setShowHint={setShowHint}
            setStr={setStr}
            gameData={gameData}
            config={config}
          />
        </div>
      </div>
      <CelebrationOverlay
        show={showCelebration}
        onComplete={handleCelebrationComplete}
        duration={6000}
      />
      {showCompletionPopup && (
        <div className="completion-overlay">
          <div className="completion-popup">
            <button
              className="close-button"
              onClick={() => setShowCompletionPopup(false)}
            >
              {completionConfig.backToPuzzleText || "Back to puzzle ×"}
            </button>
            <h3 className="completion-title">
              {completionConfig.title || "WOO HOO! YOU COMPLETED THE PUZZLE!"}
            </h3>
            <p className="completion-subtitle">
              {completionConfig.puzzleNumber || "Strands #84"}
              <br />
              " {gameConfig.themeText || "DEFAULT"} "
            </p>
            <div className="completion-emoji">
              <h1>{strEdited}</h1>
            </div>
            <p className="completion-message" dangerouslySetInnerHTML={{ __html: completionMessage }} />
            <div className="completion-buttons">
              <button
                className="close-popup-button"
                onClick={() => setShowCompletionPopup(false)}
              >
                {completionConfig.closeButtonText || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
