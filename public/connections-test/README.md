# Connections Game Test Configuration

This directory contains **static** configuration files used by Playwright tests.

## Purpose

These files are kept separate from the production configs in `/connections/` to ensure:
1. Tests run with predictable, stable data
2. Production configs can be modified without breaking tests
3. Test results are consistent across different environments

## Files

Same structure as `/connections/`:
- **puzzle.csv** - Test puzzle data
- **puzzle_um.csv** - Test UMN puzzle
- **swim_puzzle.csv** - Test swimming puzzle
- **messages.json** - Test messages
- **theme.json** - Test theme
- **celebration_overlay_gif.json** - Test celebration config

## Usage

Playwright tests automatically use this directory via the `VITE_CONNECTIONS_CONFIG_DIR` environment variable set in `playwright.config.ts`.

## Important

**Do not modify these files unless you're intentionally updating the test fixtures.**
