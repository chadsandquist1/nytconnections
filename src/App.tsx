import { useState, useEffect } from 'react';
import { Category, GameState } from './types';
import { loadPuzzleFromCSV, shuffleArray } from './utils/csvParser';
import { WordCell } from './components/WordCell';
import { CategoryRow } from './components/CategoryRow';
import { MistakeTracker } from './components/MistakeTracker';
import { GameControls } from './components/GameControls';
import { CelebrationOverlay } from './components/CelebrationOverlay';
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
    completionMessage: 'Congratulations! 🎉',
    title: 'Connections',
    instructions: 'Find groups of four items that share something in common.',
    theme: {
      primaryColor: '#5a594e',
      secondaryColor: '#000000',
      accentColor: '#f9df6d',
      backgroundImage: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load puzzle from CSV on mount
  useEffect(() => {
    loadPuzzle();
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', gameState.theme.primaryColor);
    root.style.setProperty('--secondary-color', gameState.theme.secondaryColor);
    root.style.setProperty('--accent-color', gameState.theme.accentColor);

    if (gameState.theme.backgroundImage) {
      root.style.setProperty('--background-image', `url(${gameState.theme.backgroundImage})`);
    } else {
      root.style.setProperty('--background-image', 'none');
    }
  }, [gameState.theme]);

  // Show celebration when game is won
  useEffect(() => {
    if (gameState.gameWon) {
      setShowCelebration(true);
    }
  }, [gameState.gameWon]);

  const loadPuzzle = async () => {
    try {
      setLoading(true);
      const puzzleData = await loadPuzzleFromCSV('/puzzle.csv');

      // Load theme from theme.json if it exists
      let theme = puzzleData.theme;
      try {
        const themeResponse = await fetch('/theme.json');
        if (themeResponse.ok) {
          theme = await themeResponse.json();
        }
      } catch (err) {
        console.log('No theme.json found, using CSV theme');
      }

      // Load messages from messages.json if it exists
      let completionMessage = puzzleData.completionMessage;
      let title = puzzleData.title;
      let instructions = puzzleData.instructions;
      try {
        const messagesResponse = await fetch('/messages.json');
        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();
          if (messages.completionMessage) completionMessage = messages.completionMessage;
          if (messages.title) title = messages.title;
          if (messages.instructions) instructions = messages.instructions;
        }
      } catch (err) {
        console.log('No messages.json found, using CSV messages');
      }

      // Flatten all words and shuffle them
      const allWords = puzzleData.categories.flatMap(cat => cat.words);
      const shuffledWords = shuffleArray(allWords);

      setGameState(prev => ({
        ...prev,
        categories: puzzleData.categories,
        wordBank: shuffledWords,
        completionMessage,
        title,
        instructions,
        theme,
        selectedWords: [],
        solvedCategories: [],
        mistakes: 0,
        gameOver: false,
        gameWon: false,
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
    setFeedback(null);
    setShowCelebration(false);
    loadPuzzle();
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
        <h1>{gameState.title}</h1>
        <p className="instructions">{gameState.instructions}</p>

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
            <h2>{gameState.completionMessage}</h2>
            <p>You've solved all the connections!</p>
            <button onClick={handleReset} className="reset-btn">
              Play Again
            </button>
          </div>
        )}

        {/* Reset button at bottom */}
        <div className="reset-link-container">
          <button onClick={handleReset} className="reset-link">
            Reset Game
          </button>
        </div>
      </div>

      {/* Celebration overlay */}
      <CelebrationOverlay
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
        duration={gameState.theme.celebrationDuration}
      />
    </div>
  );
}

export default App;
