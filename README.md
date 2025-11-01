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
- **Victory Celebration**: Animated GIF overlay with fireworks, balloons, and confetti when you win (displays for 6 seconds)

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

### Testing

Run the test suite:

```bash
npm run test           # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:ui        # Open Vitest UI
npm run test:coverage  # Run tests with coverage report
```

The project includes comprehensive unit tests for all components and utilities with **64 tests** achieving ~85% code coverage.

## Customizing Puzzles

Puzzles are loaded from `public/puzzle.csv`. Each puzzle must have exactly **4 categories** with **4 words each**.

### CSV Format

```csv
Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,Awesome! You're a word master! 🌟,My Custom Game,Group these themed words!
Theme,#00a8cc,#005f73,#ffd60a,https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200
Fish,Bass,Flounder,Salmon,Trout,1
Tree,Oak,Pine,Maple,Birch,2
Spice,Sage,Rosemary,Thyme,Basil,3
Circle,Ring,Loop,Hoop,Band,4
```

**Fields:**
- **Category**: The name of the category (revealed when solved)
- **Word1-Word4**: Four words belonging to this category
- **Difficulty**: 1-4 (determines the color when solved)

**Optional Customization Row (CompletionMessage):**

You can add a `CompletionMessage` row right after the header to customize the game experience:

```csv
CompletionMessage,<message>,<title>,<instructions>
```

- **Message** (optional): Custom victory message (defaults to "Congratulations! 🎉")
- **Title** (optional): Custom game title (defaults to "Connections")
- **Instructions** (optional): Custom instructions text (defaults to "Find groups of four items that share something in common.")

**Examples:**
```csv
CompletionMessage,You did it!                                    # Only custom message
CompletionMessage,You did it!,My Game                            # Message and title
CompletionMessage,You did it!,My Game,Match the words!           # All three fields
```

**Optional Theme Row:**

You can add a `Theme` row to customize the visual appearance of the game:

```csv
Theme,<primaryColor>,<secondaryColor>,<accentColor>,<backgroundImageURL>
```

- **Primary Color**: Used for selected word cells and buttons (defaults to #5a594e)
- **Secondary Color**: Used for button borders and submit button (defaults to #000000)
- **Accent Color**: Used for highlights and feedback (defaults to #f9df6d)
- **Background Image URL**: Full URL to a background image (leave empty for no image)

**Theme Examples:**
```csv
Theme,#00a8cc,#005f73,#ffd60a,https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200
Theme,#ff6b6b,#4ecdc4,#ffe66d,                                    # Colors only, no background
Theme,#2d3436,#636e72,#00b894,https://example.com/background.jpg # Complete custom theme
```

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
5. (Optional) Add a CompletionMessage row after the header to customize the victory message, game title, and/or instructions
6. (Optional) Add a Theme row to customize colors and background image
7. Save the file and refresh the browser

**Note**: The CompletionMessage and Theme rows can appear in any order after the header row and before the category rows.

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
│   │   ├── CategoryRow.tsx          # Solved category display
│   │   ├── CelebrationOverlay.tsx   # Victory celebration with animated GIFs
│   │   ├── GameControls.tsx         # Shuffle/Deselect/Submit buttons
│   │   ├── MistakeTracker.tsx       # Mistake counter
│   │   └── WordCell.tsx             # Individual word button
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
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **CSS3** - Styling and animations

## Development Tips

- The game state is managed in `src/App.tsx`
- Word shuffling happens on load and when clicking "Shuffle"
- Category matching is case-sensitive and exact
- CSS animations provide feedback for correct/incorrect guesses

## License

This is a clone for educational purposes. The original Connections game is created by The New York Times.
