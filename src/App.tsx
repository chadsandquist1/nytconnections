import { useState, useEffect } from 'react';
import { Category, GameState } from './types';
import { loadPuzzleFromCSV, shuffleArray } from './utils/csvParser';
import { WordCell } from './components/WordCell';
import { CategoryRow } from './components/CategoryRow';
import { MistakeTracker } from './components/MistakeTracker';
import { GameControls } from './components/GameControls';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    categories: [],
    wordBank: [],
    selectedWords: [],
    solvedCategories: [],
    mistakes: 0,
    maxMistakes: 4,
    gameOver: false,
    gameWon: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load puzzle from CSV on mount
  useEffect(() => {
    loadPuzzle();
  }, []);

  const loadPuzzle = async () => {
    try {
      setLoading(true);
      const categories = await loadPuzzleFromCSV('/puzzle.csv');

      // Flatten all words and shuffle them
      const allWords = categories.flatMap(cat => cat.words);
      const shuffledWords = shuffleArray(allWords);

      setGameState(prev => ({
        ...prev,
        categories,
        wordBank: shuffledWords,
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to load puzzle. Make sure puzzle.csv exists in the public folder.');
      setLoading(false);
    }
  };

  const toggleWordSelection = (word: string) => {
    setGameState(prev => {
      const isSelected = prev.selectedWords.includes(word);

      if (isSelected) {
        return {
          ...prev,
          selectedWords: prev.selectedWords.filter(w => w !== word),
        };
      } else if (prev.selectedWords.length < 4) {
        return {
          ...prev,
          selectedWords: [...prev.selectedWords, word],
        };
      }

      return prev;
    });
  };

  const handleShuffle = () => {
    setGameState(prev => ({
      ...prev,
      wordBank: shuffleArray(prev.wordBank),
    }));
  };

  const handleDeselect = () => {
    setGameState(prev => ({
      ...prev,
      selectedWords: [],
    }));
  };

  const handleSubmit = () => {
    const { selectedWords, categories, solvedCategories, mistakes, maxMistakes } = gameState;

    if (selectedWords.length !== 4) return;

    // Check if selection matches any unsolved category
    const matchedCategory = categories.find(cat => {
      if (solvedCategories.includes(cat)) return false;

      const categoryWords = cat.words.sort();
      const selectedSorted = [...selectedWords].sort();

      return categoryWords.every((word, idx) => word === selectedSorted[idx]);
    });

    if (matchedCategory) {
      // Correct guess!
      const newSolvedCategories = [...solvedCategories, matchedCategory];
      const remainingWords = gameState.wordBank.filter(
        word => !matchedCategory.words.includes(word)
      );

      setFeedback('Correct! 🎉');
      setTimeout(() => setFeedback(null), 2000);

      setGameState(prev => ({
        ...prev,
        solvedCategories: newSolvedCategories,
        wordBank: remainingWords,
        selectedWords: [],
        gameWon: newSolvedCategories.length === 4,
      }));
    } else {
      // Incorrect guess
      const newMistakes = mistakes + 1;

      setFeedback('Not quite... Try again!');
      setTimeout(() => setFeedback(null), 2000);

      setGameState(prev => ({
        ...prev,
        mistakes: newMistakes,
        selectedWords: [],
        gameOver: newMistakes >= maxMistakes,
      }));
    }
  };

  const handleReset = () => {
    loadPuzzle();
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <h1>Connections</h1>
          <p>Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <h1>Connections</h1>
          <div className="error">{error}</div>
          <button onClick={handleReset} className="reset-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const remainingWords = gameState.wordBank.filter(
    word => !gameState.solvedCategories.some(cat => cat.words.includes(word))
  );

  return (
    <div className="app">
      <div className="container">
        <h1>Connections</h1>
        <p className="instructions">Find groups of four items that share something in common.</p>

        {/* Solved categories */}
        <div className="solved-categories">
          {gameState.solvedCategories
            .sort((a, b) => a.difficulty - b.difficulty)
            .map((category, index) => (
              <CategoryRow key={index} category={category} />
            ))}
        </div>

        {/* Game feedback */}
        {feedback && <div className="feedback">{feedback}</div>}

        {/* Word grid */}
        {!gameState.gameOver && !gameState.gameWon && (
          <>
            <div className="word-grid">
              {remainingWords.map((word, index) => (
                <WordCell
                  key={index}
                  word={word}
                  isSelected={gameState.selectedWords.includes(word)}
                  onClick={() => toggleWordSelection(word)}
                />
              ))}
            </div>

            {/* Mistakes tracker */}
            <MistakeTracker mistakes={gameState.mistakes} maxMistakes={gameState.maxMistakes} />

            {/* Game controls */}
            <GameControls
              onShuffle={handleShuffle}
              onDeselect={handleDeselect}
              onSubmit={handleSubmit}
              selectedCount={gameState.selectedWords.length}
              disabled={false}
            />
          </>
        )}

        {/* Game over message */}
        {gameState.gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>You've run out of mistakes. Better luck next time!</p>
            <button onClick={handleReset} className="reset-btn">
              Play Again
            </button>
          </div>
        )}

        {/* Win message */}
        {gameState.gameWon && (
          <div className="game-won">
            <h2>Congratulations! 🎉</h2>
            <p>You've solved all the connections!</p>
            <button onClick={handleReset} className="reset-btn">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
