import React, { useState, useEffect } from "react";
import "./LetterGrid.css";

const LetterGrid = ({
  setHintCount,
  setWordsFound,
  showHint,
  setShowHint,
  setStr,
  gameData,
  config,
}) => {
  const { spangramWord, spangram, letters, ansCoordinates, ansWords } = gameData;
  const feedbackConfig = config?.ui?.game?.feedback || {};
  const tooShortText = feedbackConfig.tooShort || "Too short";
  const notInWordListText = feedbackConfig.notInWordList || "NOT IN WORD LIST";
  const spangramText = feedbackConfig.spangram || "SPANGRAM!";
  const submitButtonText = feedbackConfig.submitButtonText || "Submit Word";
  const clearButtonText = feedbackConfig.clearButtonText || "Clear";
  const messageDuration = feedbackConfig.messageDuration || 2;
  const [selectedLetters, setSelectedLetters] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [foundWords, setFoundWords] = useState([]); // Array of {wordIndex, coordinates}
  const [selectRedIds, setSelectedRedIds] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showWordPopup, setShowWordPopup] = useState(false);
  const [popupData, setPopupData] = useState({ word: "", wordIndex: null, isSpangram: false, count: 0, total: 7 });

  const timer = (seconds, callback) => {
    setTimeout(callback, seconds * 1000);
  };

  useEffect(() => {
    if (showHint) {
      setShowHint(false);
      setHintsUsed((hintsUsed) => hintsUsed + 1);
    }
  }, [showHint, setShowHint]);

  useEffect(() => {
    if (hintsUsed > 7) {
      setHintsUsed(1);
    }
  }, [hintsUsed]);

  useEffect(() => {
    if (selectedLetters.length !== selectedIds.length) {
      console.warn(
        `Data mismatch: ${selectedLetters.length} letters for ${selectedIds.length} IDs`
      );
      setSelectedLetters("");
      setSelectedIds([]);
    }
  }, [selectedLetters, selectedIds]);

  useEffect(() => {
    fetch("/strands/words.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        setWordList(text.split(/\r?\n/));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const addSelectedLetters = (letter, rowIndex, colIndex) => {
    const newId = `${rowIndex}-${colIndex}`;
    const currentLength = selectedLetters.length;

    const isAdjacent = (lastId, newId) => {
      const [lastRow, lastCol] = lastId.split("-").map(Number);
      const [newRow, newCol] = newId.split("-").map(Number);
      if (
        typeof lastRow === "undefined" ||
        typeof lastCol === "undefined" ||
        typeof newRow === "undefined" ||
        typeof newCol === "undefined"
      ) {
        return false;
      }
      return Math.abs(lastRow - newRow) <= 1 && Math.abs(lastCol - newCol) <= 1;
    };

    const lastSelectedId =
      selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] : null;

    const updateSelections = (reset) => {
      setSelectedIds(reset ? [newId] : [...selectedIds, newId]);
      setSelectedLetters(
        reset ? letter : (prevLetters) => prevLetters + letter
      );
    };

    if (!lastSelectedId) {
      updateSelections(true);
    } else if (currentLength < 20 && isAdjacent(lastSelectedId, newId)) {
      updateSelections(false);
    } else {
      updateSelections(true);
    }
  };

  function isArrayEqualUnordered(a, b) {
    const sortedA = a.slice().sort();
    const sortedB = b.slice().sort();
    return (
      sortedA.length === sortedB.length &&
      sortedA.every((element, index) => element === sortedB[index])
    );
  }

  function checkArrayMatch(arrA, arrB) {
    if (Array.isArray(arrB[0])) {
      return arrB.some((subArray) => {
        return isArrayEqualUnordered(arrA, subArray);
      });
    } else {
      return isArrayEqualUnordered(arrA, arrB);
    }
  }

  const checkWordList = () => {
    const currentLength = selectedLetters.length;
    const clearSelectedLetters = (delay) => {
      timer(delay, () => {
        setSelectedLetters("");
        setSelectedIds([]);
      });
    };
    if (currentLength <= 3) {
      setSelectedLetters(tooShortText);
      clearSelectedLetters(messageDuration);
    } else if (
      checkArrayMatch(selectedIds, ansCoordinates) &&
      ansWords.includes(selectedLetters)
    ) {
      const wordIndex = ansWords.indexOf(selectedLetters);
      const newCount = foundWords.length + 1;
      setWordsFound((wordsFound) => wordsFound + 1);
      setStr((prevStr) => prevStr + "🔵");
      setFoundWords((prevWords) => [...prevWords, { wordIndex, coordinates: selectedIds }]);

      // Show popup
      setPopupData({ word: selectedLetters, wordIndex, isSpangram: false, count: newCount, total: 7 });
      setShowWordPopup(true);
      timer(2, () => setShowWordPopup(false));

      clearSelectedLetters(2);
    } else if (
      checkArrayMatch(selectedIds, spangram) &&
      spangramWord === selectedLetters
    ) {
      setSelectedLetters(spangramText);
      setWordsFound((wordsFound) => wordsFound + 1);
      setStr((prevStr) => prevStr + "🟡");
      setSelectedRedIds(selectedIds);

      // Show popup for spangram
      const currentCount = foundWords.length + 1;
      setPopupData({ word: selectedLetters, wordIndex: null, isSpangram: true, count: currentCount, total: 8 });
      setShowWordPopup(true);
      timer(2, () => setShowWordPopup(false));

      clearSelectedLetters(3);
    } else if (wordList.includes(selectedLetters)) {
      setHintCount((hintCount) => hintCount + 1);
      clearSelectedLetters(messageDuration);
    } else {
      setSelectedLetters(notInWordListText);
      clearSelectedLetters(messageDuration);
    }
  };

  const handleIsSelecting = (letter, rowIndex, colIndex) => {
    const newId = `${rowIndex}-${colIndex}`;
    const isFoundCell = foundWords.some(word => word.coordinates.includes(newId)) || selectRedIds.includes(newId);

    if (!isFoundCell) {
      if (selectedIds.includes(newId)) {
        // On mobile, don't auto-submit when tapping already selected letter
        // Just continue selecting
        setIsSelecting(true);
      } else {
        setIsSelecting(true);
        addSelectedLetters(letter, rowIndex, colIndex);
      }
    }
  };

  const handleIsDragging = (letter, rowIndex, colIndex) => {
    const newId = `${rowIndex}-${colIndex}`;
    const isFoundCell = foundWords.some(word => word.coordinates.includes(newId)) || selectRedIds.includes(newId);

    if (!isFoundCell) {
      if (!selectedIds.includes(newId) && isSelecting) {
        addSelectedLetters(letter, rowIndex, colIndex);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    if (touch) {
      const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );

      if (targetElement && targetElement.tagName === "BUTTON") {
        const letter = targetElement.dataset.letter || "";
        const rowIndex = targetElement.dataset.rowIndex || "0";
        const colIndex = targetElement.dataset.colIndex || "0";

        handleIsDragging(letter, parseInt(rowIndex), parseInt(colIndex));
      }
    }
  };

  const handleTouchStart = (e, letter, rowIndex, colIndex) => {
    handleIsSelecting(letter, rowIndex, colIndex);
  };

  const handleTouchEnd = () => {
    setIsSelecting(false);
  };

  return (
    <div className="letter-grid-container">
      {showWordPopup && (
        <div className="word-popup-overlay">
          <div className={`word-popup ${popupData.isSpangram ? 'word-popup-red' : `word-popup-blue-${popupData.wordIndex}`}`}>
            <div className="word-popup-emoji">✓</div>
            <div className="word-popup-word">{popupData.word}</div>
            <div className="word-popup-progress">({popupData.count}/{popupData.total})</div>
          </div>
        </div>
      )}
      <div className={`word-display ${selectedLetters === notInWordListText ? "small-text" : ""}`}>
        {selectedLetters}
      </div>
      <div className="submit-button-container">
        {selectedLetters.length > 0 && selectedLetters !== tooShortText && selectedLetters !== notInWordListText && selectedLetters !== spangramText ? (
          <>
            <button className="submit-word-button" onClick={checkWordList}>
              {submitButtonText}
            </button>
            <button className="clear-word-button" onClick={() => { setSelectedLetters(""); setSelectedIds([]); }}>
              {clearButtonText}
            </button>
          </>
        ) : (
          // Empty placeholder to maintain spacing
          <div className="button-placeholder"></div>
        )}
      </div>
      <div className="grid-container" onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {letters.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((letter, colIndex) => {
              const letterId = `${rowIndex}-${colIndex}`;
              const isBrownSelected = selectedIds.includes(letterId);
              const isRedSelected = selectRedIds.includes(letterId);
              const foundWord = foundWords.find(word => word.coordinates.includes(letterId));
              const isDashedSelected =
                ansCoordinates[hintsUsed - 1]?.includes(letterId);

              let buttonClass = "letter-button";
              if (isDashedSelected) buttonClass += " hint-dashed";
              if (isRedSelected) buttonClass += " red-selected";
              else if (foundWord) buttonClass += ` blue-selected-${foundWord.wordIndex}`;
              else if (isBrownSelected) buttonClass += " brown-selected";

              return (
                <button
                  key={colIndex}
                  className={buttonClass}
                  data-letter={letter}
                  data-row-index={rowIndex}
                  data-col-index={colIndex}
                  onMouseDown={() =>
                    handleIsSelecting(letter, rowIndex, colIndex)
                  }
                  onMouseMove={() =>
                    handleIsDragging(letter, rowIndex, colIndex)
                  }
                  onTouchStart={(e) => handleTouchStart(e, letter, rowIndex, colIndex)}
                >
                  {letter}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LetterGrid;
