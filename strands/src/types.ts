// Types for Strands game configuration and data

export interface HomeConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  playButtonText?: string;
  creditLine1?: string;
  creditLine2?: string;
}

export interface FeedbackConfig {
  tooShort?: string;
  notInWordList?: string;
  spangram?: string;
  submitButtonText?: string;
  clearButtonText?: string;
  messageDuration?: number;
}

export interface GameConfig {
  puzzleNumber?: string;
  themeLabel?: string;
  themeText?: string;
  wordsFoundLabel?: string;
  totalWords?: number;
  hintButtonText?: string;
  viewResultsText?: string;
  feedback?: FeedbackConfig;
}

export interface CompletionConfig {
  title?: string;
  puzzleNumber?: string;
  shareButtonText?: string;
  shareButtonCopied?: string;
  closeButtonText?: string;
  backToPuzzleText?: string;
  messageTemplate?: string;
  shareTextTemplate?: string;
}

export interface UIConfig {
  home?: HomeConfig;
  game?: GameConfig;
  completion?: CompletionConfig;
}

export interface SpangramData {
  word: string;
  coordinates: string[];
}

export interface WordData {
  coordinates: string[];
}

export interface PuzzleConfig {
  spangram: SpangramData;
  grid: string[][];
  words: Record<string, WordData>;
}

export interface StrandsConfig {
  ui: UIConfig;
  puzzle?: PuzzleConfig;
}

export interface GameData {
  spangramWord: string;
  spangram: string[];
  letters: string[][];
  ansWords: string[];
  ansCoordinates: string[][];
}

export interface FoundWord {
  wordIndex: number;
  coordinates: string[];
}

export interface PopupData {
  word: string;
  wordIndex: number | null;
  isSpangram: boolean;
  count: number;
  total: number;
}

export interface GifPosition {
  url: string;
  top: string;
  left: string;
  width: string;
  height: string;
  animation: string;
  animationDelay: string;
}

export interface CelebrationData {
  celebration_overlays: string[];
  count?: number;
  mobileCount?: number;
  webCount?: number;
}
