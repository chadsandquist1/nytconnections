export interface Category {
  name: string;
  words: string[];
  difficulty: number;
}

export interface GameState {
  categories: Category[];
  wordBank: string[];
  selectedWords: string[];
  solvedCategories: Category[];
  mistakes: number;
  maxMistakes: number;
  gameOver: boolean;
  gameWon: boolean;
}

export const DIFFICULTY_COLORS = {
  1: '#f9df6d', // Yellow (Straightforward)
  2: '#a0c35a', // Green (Intermediate)
  3: '#b0c4ef', // Blue (Tricky)
  4: '#ba81c5', // Purple (Challenging)
};
