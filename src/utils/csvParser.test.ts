import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadPuzzleFromCSV, shuffleArray } from './csvParser';

describe('csvParser', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it('should contain all original elements', () => {
      const input = ['a', 'b', 'c', 'd'];
      const result = shuffleArray(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it('should not modify the original array', () => {
      const input = [1, 2, 3];
      const original = [...input];
      shuffleArray(input);
      expect(input).toEqual(original);
    });

    it('should handle empty array', () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });
  });

  describe('loadPuzzleFromCSV', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should load and parse a valid CSV file', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');

      expect(result.categories).toHaveLength(4);
      expect(result.completionMessage).toBe('Congratulations! 🎉');
      expect(result.title).toBe('Connections');
      expect(result.instructions).toBe('Find groups of four items that share something in common.');
      expect(result.theme).toEqual({
        primaryColor: '#5a594e',
        secondaryColor: '#000000',
        accentColor: '#f9df6d',
        backgroundImage: '',
      });
      expect(result.categories[0]).toEqual({
        name: 'Farm Animals',
        words: ['Cow', 'Pig', 'Sheep', 'Horse'],
        difficulty: 1,
      });
      expect(result.categories[1]).toEqual({
        name: 'Colors',
        words: ['Red', 'Blue', 'Green', 'Yellow'],
        difficulty: 2,
      });
    });

    it('should throw error if fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(loadPuzzleFromCSV('/puzzle.csv')).rejects.toThrow();
    });

    it('should throw error if CSV has wrong number of categories', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      await expect(loadPuzzleFromCSV('/puzzle.csv')).rejects.toThrow(
        'Expected 4 categories, but found 2'
      );
    });

    it('should handle CSV with extra whitespace', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
Farm Animals , Cow , Pig , Sheep , Horse , 1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.categories[0].name).toBe('Farm Animals');
      expect(result.categories[0].words[0]).toBe('Cow');
    });

    it('should load custom completion message from CSV', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,Great job! You're amazing!
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.completionMessage).toBe('Great job! You\'re amazing!');
      expect(result.title).toBe('Connections');
      expect(result.instructions).toBe('Find groups of four items that share something in common.');
      expect(result.categories).toHaveLength(4);
    });

    it('should load custom title and instructions from CSV', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,You did it!,My Custom Game,Try to match these words!
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.completionMessage).toBe('You did it!');
      expect(result.title).toBe('My Custom Game');
      expect(result.instructions).toBe('Try to match these words!');
      expect(result.categories).toHaveLength(4);
    });

    it('should handle completion message with commas when title and instructions provided', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,Wow, incredible, you did it!,Amazing Game,Group the words together!
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.completionMessage).toBe('Wow, incredible, you did it!');
      expect(result.title).toBe('Amazing Game');
      expect(result.instructions).toBe('Group the words together!');
    });

    it('should load only message and title when instructions not provided', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,Great job!,My Game
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.completionMessage).toBe('Great job!');
      expect(result.title).toBe('My Game');
      expect(result.instructions).toBe('Find groups of four items that share something in common.');
    });

    it('should load custom theme from CSV', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
Theme,#ff0000,#00ff00,#0000ff,https://example.com/image.jpg
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.theme).toEqual({
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        accentColor: '#0000ff',
        backgroundImage: 'https://example.com/image.jpg',
      });
      expect(result.categories).toHaveLength(4);
    });

    it('should load theme with CompletionMessage', async () => {
      const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
CompletionMessage,You won!,My Game,Play this game!
Theme,#123456,#abcdef,#fedcba,https://example.com/bg.png
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockCSV,
      });

      const result = await loadPuzzleFromCSV('/puzzle.csv');
      expect(result.completionMessage).toBe('You won!');
      expect(result.title).toBe('My Game');
      expect(result.instructions).toBe('Play this game!');
      expect(result.theme).toEqual({
        primaryColor: '#123456',
        secondaryColor: '#abcdef',
        accentColor: '#fedcba',
        backgroundImage: 'https://example.com/bg.png',
      });
    });
  });
});
