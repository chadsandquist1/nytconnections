# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based clone of the NYT Connections game where players find groups of four words that share a common connection. The game features a 4x4 grid with four difficulty-colored categories, mistake tracking, and CSV-based puzzle configuration.

## Development Commands

### Running the Application
```bash
npm run dev          # Start dev server on http://localhost:8000
npm run build        # Type-check and build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test              # Run all tests once
npm run test:watch        # Run tests in watch mode
npm run test:ui           # Open Vitest UI
npm run test:coverage     # Run tests with coverage report
```

### Linting
```bash
npm run lint         # Run ESLint on TypeScript files
```

## Architecture

### Game State Management

The game state is centrally managed in `src/App.tsx` using React useState. The main `GameState` interface (defined in `src/types.ts`) includes:
- `categories`: All puzzle categories loaded from CSV
- `wordBank`: Currently displayed words (shuffled, excludes solved)
- `selectedWords`: User's current selection (max 4)
- `solvedCategories`: Categories the user has correctly guessed
- `mistakes`: Current mistake count (max 4 allowed)
- `gameOver`/`gameWon`: Game end states
- `completionMessage`, `title`, `instructions`: Customizable text
- `theme`: Color scheme and background image configuration

### Data Flow

1. **Puzzle Loading** (`src/utils/csvParser.ts`):
   - Fetches `/public/puzzle.csv` on mount
   - Parses optional `CompletionMessage` and `Theme` rows
   - Validates exactly 4 categories with 4 words each
   - Can override CSV settings with `/public/theme.json` or `/public/messages.json`

2. **Word Selection** (`src/App.tsx:120-138`):
   - Click to select/deselect words (max 4 selected)
   - Selected state tracked in `gameState.selectedWords`

3. **Submission Logic** (`src/App.tsx:154-200`):
   - Validates selection against unsolved categories
   - Uses sorted array comparison for matching
   - On correct: removes words from grid, adds to `solvedCategories`
   - On incorrect: increments mistakes, clears selection
   - Win condition: all 4 categories solved
   - Lose condition: 4 mistakes reached

4. **Theme Application** (`src/App.tsx:42-54`):
   - CSS custom properties updated via `useEffect` when theme changes
   - Properties: `--primary-color`, `--secondary-color`, `--accent-color`, `--background-image`

### Component Structure

- **App.tsx**: Root component containing all game logic and state
- **WordCell.tsx**: Individual word button with selection state
- **CategoryRow.tsx**: Displays solved category with difficulty-based color
- **MistakeTracker.tsx**: Visual indicator of remaining mistakes
- **GameControls.tsx**: Shuffle/Deselect/Submit buttons
- **CelebrationOverlay.tsx**: Victory animation overlay (configurable duration)

### Type Definitions (`src/types.ts`)

Core types:
- `Category`: name, words array, difficulty (1-4)
- `Theme`: colors and background image URL, optional celebrationDuration
- `PuzzleData`: full puzzle structure from CSV
- `GameState`: complete application state
- `DIFFICULTY_COLORS`: maps difficulty levels to hex colors

### CSV Format

The game supports two configuration methods:
1. **CSV-based** (primary): `public/puzzle.csv` with optional CompletionMessage/Theme rows
2. **JSON override** (optional): `public/messages.json` and `public/theme.json` override CSV values

CSV structure:
```csv
Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,<message>,<title>,<instructions>
Theme,<primaryColor>,<secondaryColor>,<accentColor>,<backgroundImageURL>
<CategoryName>,<word>,<word>,<word>,<word>,<1-4>
```

### Testing Strategy

Tests are written using Vitest + React Testing Library:
- Component tests verify rendering, user interactions, and prop handling
- `csvParser.test.ts` validates CSV parsing logic with various formats
- `App.test.tsx` tests core game logic (selection, submission, win/lose conditions)
- Test setup in `src/test/setup.ts` configures jsdom environment

## Key Implementation Details

### Word Matching Algorithm
Category matching uses sorted array comparison to ensure order-independent matching. Selection must exactly match a category's four words (case-sensitive).

### State Updates
All state updates use functional setState to avoid stale closures. Feedback messages auto-dismiss after 2 seconds using setTimeout.

### Shuffle Implementation
Fisher-Yates shuffle algorithm in `csvParser.ts:104-111` provides unbiased randomization.

### Theme Customization
The app supports three levels of customization (in priority order):
1. JSON files (`theme.json`, `messages.json`) - highest priority
2. CSV rows (`Theme`, `CompletionMessage`)
3. Hardcoded defaults - lowest priority

### Victory Celebration
The celebration overlay appears when `gameWon` becomes true. Duration defaults to 6 seconds but can be customized via `theme.celebrationDuration` (in milliseconds).

IMPORTANT: NEVER CHECK IN THE TF STATE FILES.