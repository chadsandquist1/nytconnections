import React, { useState, useEffect } from "react";
import LetterGrid from "./LetterGrid";
import Tracker from "./Tracker";
import "./Play.css";

const Play = ({ config, gameData, onRestartGame, onBackToMenu }) => {
  const [hintCount, setHintCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wordsFound, setWordsFound] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
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
        setShowCompletionPopup(true);
      });
    }
  }, [wordsFound, totalWords]);

  const characters = Array.from(str);
  const strEdited = characters.reduce((acc, curr, index) => {
    acc.push(curr);
    if ((index + 1) % 4 === 0 && index + 1 !== characters.length) {
      acc.push(<br key={index} />);
    }
    return acc;
  }, []);

  const strEdited2 = () => {
    const characters = Array.from(str);
    let result = "";
    for (let i = 0; i < characters.length; i++) {
      result += characters[i];
      if ((i + 1) % 4 === 0 && i + 1 !== characters.length) {
        result += "\n";
      }
    }
    return result;
  };

  const shareText = (completionConfig.shareTextTemplate || 'Strands #84\n"Deviled eggs anyone?"\n{emojiString}')
    .replace('{emojiString}', strEdited2());

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };

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
          />
        </div>
      </div>
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
                onClick={copyToClipboard}
                className="share-button"
              >
                {copySuccess ? (completionConfig.shareButtonCopied || "Copied!") : (completionConfig.shareButtonText || "Share Your Results")}
              </button>
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
