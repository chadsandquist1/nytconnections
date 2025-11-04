# Connections Game Configuration

This directory contains the configuration files for the NYT Connections game.

## Files

- **puzzle.csv** - Main puzzle data (categories and words)
- **puzzle_um.csv** - University of Minnesota themed puzzle
- **swim_puzzle.csv** - Swimming themed puzzle
- **messages.json** - Custom messages (title, instructions, completion message)
- **theme.json** - Theme configuration (colors, background, celebration duration)
- **celebration_overlay_gif.json** - Celebration GIF overlay configuration

## Environment Variable

The game reads from the directory specified by `VITE_CONNECTIONS_CONFIG_DIR` environment variable:
- Production: `/connections` (default)
- Testing: `/connections-test` (Playwright tests)

## Modifying Configuration

To change the active puzzle, edit `puzzle.csv` or update the code to point to a different CSV file.

To customize the theme, edit `theme.json`:
```json
{
  "primaryColor": "#7A0019",
  "secondaryColor": "#FFCC33",
  "accentColor": "#000000",
  "backgroundImage": "/Fall_1080x1920.jpg",
  "celebrationDuration": 25000
}
```

To customize messages, edit `messages.json`:
```json
{
  "title": "Connections",
  "instructions": "Find groups of four items that share something in common.",
  "completionMessage": "Congratulations! 🎉"
}
```
