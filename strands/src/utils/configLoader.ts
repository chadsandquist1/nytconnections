import type { StrandsConfig, GameData } from '../types';

// Utility to load and parse the strands configuration
let configCache: StrandsConfig | null = null;

export const loadConfig = async (): Promise<StrandsConfig> => {
  if (configCache) {
    return configCache;
  }

  try {
    const response = await fetch('/strands/strands-config.json');
    if (!response.ok) {
      throw new Error('Failed to load configuration');
    }
    const config: StrandsConfig = await response.json();
    configCache = config;
    return config;
  } catch (error) {
    console.error('Error loading strands configuration:', error);
    // Return a minimal default config if loading fails
    return getDefaultConfig();
  }
};

// Helper functions to extract game data from config
export const getGameData = (config: StrandsConfig): GameData => {
  const { puzzle } = config;

  if (!puzzle) {
    throw new Error('Puzzle data must be loaded from strands-config.json');
  }

  // Extract spangram data
  const spangramWord = puzzle.spangram.word;
  const spangram = puzzle.spangram.coordinates;

  // Extract grid letters
  const letters = puzzle.grid;

  // Extract answer words and coordinates
  const ansWords = Object.keys(puzzle.words);
  const ansCoordinates = Object.values(puzzle.words).map(word => word.coordinates);

  return {
    spangramWord,
    spangram,
    letters,
    ansWords,
    ansCoordinates
  };
};

// Default configuration fallback
const getDefaultConfig = (): StrandsConfig => {
  const config: StrandsConfig = {
    ui: {
      home: {
        title: "Strands",
        subtitle: "Custom Edition",
        description: "Find hidden words and uncover the day's theme",
        playButtonText: "Play",
        creditLine1: "Designed in Edina",
        creditLine2: "Puzzle by Chad and Claude!"
      },
      game: {
        puzzleNumber: "#1",
        themeLabel: "TODAY'S THEME",
        themeText: "DEFAULT",
        wordsFoundLabel: "theme words found",
        totalWords: 8,
        hintButtonText: "Hint",
        viewResultsText: "View Results"
      },
      completion: {
        title: "WOO HOO! YOU COMPLETED THE PUZZLE!",
        puzzleNumber: "Strands #1",
        shareButtonText: "Share Your Results",
        shareButtonCopied: "Copied!",
        closeButtonText: "Close",
        backToPuzzleText: "Back to puzzle ×",
        messageTemplate: "Nice job finding the theme words 🔵 and <br />Spangram 🟡. You used {hintsUsed} hints 💡.",
        shareTextTemplate: "Strands #1\n\"DEFAULT\"\n{emojiString}"
      }
    }
  };

  // Create a Proxy to throw an error if puzzle is accessed
  return new Proxy(config, {
    get(target: StrandsConfig, prop: string | symbol): unknown {
      if (prop === 'puzzle') {
        throw new Error('Puzzle data must be loaded from strands-config.json. Default config does not include puzzle data.');
      }
      return target[prop as keyof StrandsConfig];
    }
  }) as StrandsConfig;
};
