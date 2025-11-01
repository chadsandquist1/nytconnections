# NYT Connections Game Clone

A React-based clone of the New York Times Connections game, built with Vite and TypeScript.

## Features

- **4x4 Grid Gameplay**: Find groups of four words that share a common connection
- **Difficulty Levels**: Four categories with color-coded difficulty (Yellow → Green → Blue → Purple)
- **Mistake Tracking**: 4 strikes maximum before game over
- **Interactive Controls**:
  - Shuffle: Randomize the order of remaining words
  - Deselect All: Clear your current selection
  - Submit: Check if your selection is correct
- **CSV-Based Puzzles**: Easily configure puzzles via CSV file

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Running the Game

```bash
npm run dev
```

The game will be available at **http://localhost:8000**

### Building for Production

```bash
npm run build
```

## Customizing Puzzles

Puzzles are loaded from `public/puzzle.csv`. Each puzzle must have exactly **4 categories** with **4 words each**.

### CSV Format

```csv
Category,Word1,Word2,Word3,Word4,Difficulty
Fish,Bass,Flounder,Salmon,Trout,1
Tree,Oak,Pine,Maple,Birch,2
Spice,Sage,Rosemary,Thyme,Basil,3
Circle,Ring,Loop,Hoop,Band,4
```

**Fields:**
- **Category**: The name of the category (revealed when solved)
- **Word1-Word4**: Four words belonging to this category
- **Difficulty**: 1-4 (determines the color when solved)

**Difficulty Colors:**
- 1 = Yellow (Straightforward)
- 2 = Green (Intermediate)
- 3 = Blue (Tricky)
- 4 = Purple (Challenging)

### Creating New Puzzles

1. Edit `public/puzzle.csv`
2. Ensure you have exactly 4 categories
3. Each category must have exactly 4 words
4. Assign difficulty levels 1-4
5. Save the file and refresh the browser

## Game Rules

1. Click words to select them (up to 4 at a time)
2. When you have 4 words selected, click **Submit**
3. If correct, the category is revealed and removed from the board
4. If incorrect, you lose one mistake
5. You have 4 mistakes before game over
6. Win by solving all 4 categories

## Project Structure

```
nytconnections/
├── public/
│   └── puzzle.csv          # Puzzle configuration
├── src/
│   ├── components/
│   │   ├── CategoryRow.tsx     # Solved category display
│   │   ├── GameControls.tsx    # Shuffle/Deselect/Submit buttons
│   │   ├── MistakeTracker.tsx  # Mistake counter
│   │   └── WordCell.tsx        # Individual word button
│   ├── utils/
│   │   └── csvParser.ts        # CSV loading and parsing
│   ├── App.tsx             # Main game logic
│   ├── App.css             # Game styling
│   ├── types.ts            # TypeScript type definitions
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling and animations

## Development Tips

- The game state is managed in `src/App.tsx`
- Word shuffling happens on load and when clicking "Shuffle"
- Category matching is case-sensitive and exact
- CSS animations provide feedback for correct/incorrect guesses

## License

This is a clone for educational purposes. The original Connections game is created by The New York Times.
