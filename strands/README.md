# Strands Puzzle Game

A React-based implementation of a Strands-style word puzzle game featuring the All Star Cheer theme.

## Features

- Interactive 8x6 letter grid
- Spangram with L-shaped path (NORTHERN)
- 7 theme words related to All Star Cheer
- Celebration animations on completion
- Mobile-responsive design

## Development

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Run Validation Tests Only

```bash
npm test tests/validatePuzzle.test.js
```

## Git Hooks Setup

This project includes a pre-commit hook that automatically validates the puzzle configuration before allowing commits. This ensures that all puzzle changes maintain valid adjacency rules and coordinate uniqueness.

### Installing the Pre-commit Hook

1. Navigate to the strands directory:
   ```bash
   cd /path/to/strands
   ```

2. Configure git to use the custom hooks directory:
   ```bash
   git config core.hooksPath .git-hooks
   ```

3. Verify the hook is executable:
   ```bash
   chmod +x .git-hooks/pre-commit
   ```

### What the Hook Does

The pre-commit hook runs automatically before each commit and:
- ✅ Validates puzzle grid dimensions (8x6)
- ✅ Checks all words spell correctly from grid coordinates
- ✅ Verifies adjacency rules (8-directional)
- ✅ Ensures no coordinate reuse (all 48 cells used exactly once)
- ✅ Confirms NORTHERN spangram has an L-shaped turn

If any validation fails, the commit will be blocked until issues are fixed.

### Manual Validation

You can manually run the validation tests at any time:

```bash
npm test tests/validatePuzzle.test.js
```

## Puzzle Configuration

The puzzle is configured in `public/strands-config.json`. It includes:
- **Grid**: 8x6 letter grid
- **Spangram**: NORTHERN (8 letters with L-turn)
- **Theme Words**: FRENZY, RAMPAGE, RIPTIDE, SMACK, FIRE, SPARKS, SHADE

### Puzzle Rules

1. All 48 cells must be used exactly once
2. Each word's coordinates must be adjacent (8-directional: horizontal, vertical, diagonal)
3. No coordinate can be reused across words
4. The spangram must span from one edge to another with at least one turn

## Deployment

The app is deployed to AWS S3. To sync:

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name/strands/ --delete
```
