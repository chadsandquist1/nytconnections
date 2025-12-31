/**
 * Unit tests for Strands puzzle validation
 * Validates grid integrity, adjacency rules, and coordinate uniqueness
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

let config;

beforeAll(() => {
  const configPath = path.join(__dirname, '../public/strands-config.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configData);
});

/**
 * Check if two coordinates are adjacent (8-directional)
 * @param {string} c1 - First coordinate (format: "row-col")
 * @param {string} c2 - Second coordinate (format: "row-col")
 * @returns {boolean} - True if coordinates are adjacent
 */
function isAdjacent(c1, c2) {
  const [r1, col1] = c1.split('-').map(Number);
  const [r2, col2] = c2.split('-').map(Number);
  return Math.abs(r1 - r2) <= 1 && Math.abs(col1 - col2) <= 1 && c1 !== c2;
}

/**
 * Validate that all coordinates in a path are adjacent
 * @param {string[]} path - Array of coordinates
 * @returns {boolean} - True if all adjacent
 */
function validateAdjacency(path) {
  for (let i = 0; i < path.length - 1; i++) {
    if (!isAdjacent(path[i], path[i + 1])) {
      return false;
    }
  }
  return true;
}

describe('Strands Puzzle Validation', () => {
  describe('Configuration Structure', () => {
    it('should have puzzle configuration', () => {
      expect(config).toBeDefined();
      expect(config.puzzle).toBeDefined();
    });

    it('should have spangram definition', () => {
      expect(config.puzzle.spangram).toBeDefined();
      expect(config.puzzle.spangram.word).toBe('NORTHERN');
      expect(config.puzzle.spangram.coordinates).toBeInstanceOf(Array);
    });

    it('should have grid array', () => {
      expect(config.puzzle.grid).toBeInstanceOf(Array);
      expect(config.puzzle.grid.length).toBe(8);
      config.puzzle.grid.forEach(row => {
        expect(row.length).toBe(6);
      });
    });

    it('should have words object', () => {
      expect(config.puzzle.words).toBeDefined();
      expect(typeof config.puzzle.words).toBe('object');
    });
  });

  describe('Grid Dimensions', () => {
    it('should have exactly 8 rows', () => {
      expect(config.puzzle.grid.length).toBe(8);
    });

    it('should have exactly 6 columns in each row', () => {
      config.puzzle.grid.forEach((row, index) => {
        expect(row.length).toBe(6, `Row ${index} should have 6 columns`);
      });
    });

    it('should have exactly 48 cells total', () => {
      const totalCells = config.puzzle.grid.reduce((sum, row) => sum + row.length, 0);
      expect(totalCells).toBe(48);
    });
  });

  describe('Spangram (NORTHERN)', () => {
    it('should have exactly 8 letters', () => {
      expect(config.puzzle.spangram.coordinates.length).toBe(8);
    });

    it('should spell NORTHERN correctly', () => {
      const letters = config.puzzle.spangram.coordinates.map(coord => {
        const [row, col] = coord.split('-').map(Number);
        return config.puzzle.grid[row][col];
      });
      expect(letters.join('')).toBe('NORTHERN');
    });

    it('should follow adjacency rules', () => {
      const isValid = validateAdjacency(config.puzzle.spangram.coordinates);
      expect(isValid).toBe(true);
    });

    it('should have an L-shaped turn (not straight line)', () => {
      const coords = config.puzzle.spangram.coordinates;
      const directions = [];

      for (let i = 0; i < coords.length - 1; i++) {
        const [r1, c1] = coords[i].split('-').map(Number);
        const [r2, c2] = coords[i + 1].split('-').map(Number);
        const direction = `${r2 - r1},${c2 - c1}`;
        directions.push(direction);
      }

      // Check that there are at least 2 different directions (indicating a turn)
      const uniqueDirections = new Set(directions);
      expect(uniqueDirections.size).toBeGreaterThan(1);
    });
  });

  describe('Theme Words', () => {
    const expectedWords = ['FRENZY', 'RAMPAGE', 'RIPTIDE', 'SMACK', 'FIRE', 'SPARKS', 'SHADE'];

    it('should have exactly 7 theme words', () => {
      expect(Object.keys(config.puzzle.words).length).toBe(7);
    });

    it('should have all expected theme words', () => {
      expectedWords.forEach(word => {
        expect(config.puzzle.words[word]).toBeDefined();
      });
    });

    expectedWords.forEach(word => {
      describe(`${word}`, () => {
        it('should have correct length', () => {
          const expectedLength = word.length;
          expect(config.puzzle.words[word].coordinates.length).toBe(expectedLength);
        });

        it('should spell correctly from grid', () => {
          const letters = config.puzzle.words[word].coordinates.map(coord => {
            const [row, col] = coord.split('-').map(Number);
            return config.puzzle.grid[row][col];
          });
          expect(letters.join('')).toBe(word);
        });

        it('should follow adjacency rules', () => {
          const isValid = validateAdjacency(config.puzzle.words[word].coordinates);
          expect(isValid).toBe(true);
        });
      });
    });
  });

  describe('Coordinate Uniqueness', () => {
    it('should use all 48 cells exactly once', () => {
      const allCoords = [];

      // Add spangram coordinates
      allCoords.push(...config.puzzle.spangram.coordinates);

      // Add all word coordinates
      Object.values(config.puzzle.words).forEach(word => {
        allCoords.push(...word.coordinates);
      });

      expect(allCoords.length).toBe(48);
    });

    it('should have no coordinate reuse', () => {
      const allCoords = [];

      // Add spangram coordinates
      allCoords.push(...config.puzzle.spangram.coordinates);

      // Add all word coordinates
      Object.values(config.puzzle.words).forEach(word => {
        allCoords.push(...word.coordinates);
      });

      const uniqueCoords = new Set(allCoords);
      expect(uniqueCoords.size).toBe(allCoords.length);
    });

    it('should not have any coordinate used more than once', () => {
      const allCoords = [];
      const coordCounts = {};

      // Add spangram coordinates
      allCoords.push(...config.puzzle.spangram.coordinates);

      // Add all word coordinates
      Object.values(config.puzzle.words).forEach(word => {
        allCoords.push(...word.coordinates);
      });

      // Count occurrences
      allCoords.forEach(coord => {
        coordCounts[coord] = (coordCounts[coord] || 0) + 1;
      });

      // Check for duplicates
      const duplicates = Object.entries(coordCounts).filter(([coord, count]) => count > 1);

      expect(duplicates).toEqual([]);
    });
  });

  describe('Grid Integrity', () => {
    it('should have no undefined or null cells', () => {
      config.puzzle.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell).toBeDefined();
          expect(cell).not.toBeNull();
          expect(typeof cell).toBe('string');
          expect(cell.length).toBe(1);
        });
      });
    });

    it('should have only uppercase letters', () => {
      config.puzzle.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell).toMatch(/^[A-Z]$/);
        });
      });
    });
  });

  describe('Coordinate Format', () => {
    it('should have valid coordinate format (row-col)', () => {
      const allCoords = [
        ...config.puzzle.spangram.coordinates,
        ...Object.values(config.puzzle.words).flatMap(word => word.coordinates)
      ];

      allCoords.forEach(coord => {
        expect(coord).toMatch(/^\d+-\d+$/);
        const [row, col] = coord.split('-').map(Number);
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(8);
        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(6);
      });
    });
  });
});
