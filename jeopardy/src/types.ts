// Types for Jeopardy game

export interface JeopardyClue {
  id: number;
  question: string;
  answer: string;
  value: number;
  category_id: number;
}

export interface JeopardyCategory {
  id: number;
  title: string;
  clues: JeopardyClue[];
}

export interface GameBoard {
  categories: Omit<JeopardyCategory, 'clues'>[];
  clues: Record<string, JeopardyClue[]>;
}

export interface MockData {
  gameBoards: GameBoard[];
}
