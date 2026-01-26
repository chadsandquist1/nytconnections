export interface VisualAssertion {
  selector: string;
  description: string;
  checkVisible?: boolean;
  checkText?: string;
  checkCount?: number;
}

export interface AppConfig {
  name: string;
  cardClass: string;
  localPath: string;
  remotePath: string;
  hasRoot: boolean;
  visualAssertions?: VisualAssertion[];
}

export const apps: AppConfig[] = [
  {
    name: 'Connections',
    cardClass: 'game',
    localPath: '/dist/game.html',
    remotePath: '/game.html',
    hasRoot: true,
    visualAssertions: [
      { selector: 'h1', description: 'Title heading', checkVisible: true },
      { selector: '.word-grid', description: 'Word grid container', checkVisible: true },
      { selector: '.word-cell', description: 'Word cells', checkCount: 16 },
      { selector: '.game-controls button', description: 'Game control buttons', checkVisible: true },
    ],
  },
  {
    name: 'Strands',
    cardClass: 'strands',
    localPath: '/strands/dist/',
    remotePath: '/strands/',
    hasRoot: true,
    visualAssertions: [
      { selector: '.home-container, .play-container, #root', description: 'Main container', checkVisible: true },
      { selector: 'button', description: 'Buttons present', checkVisible: true },
    ],
  },
  {
    name: 'Jeopardy',
    cardClass: 'jeopardy',
    localPath: '/jeopardy/dist/',
    remotePath: '/jeopardy/',
    hasRoot: true,
    visualAssertions: [
      { selector: '.jeopardy-board', description: 'Jeopardy board', checkVisible: true },
      { selector: '.back-to-home__button', description: 'Back to home button', checkVisible: true },
      { selector: '.new-game-button', description: 'New game button', checkVisible: true },
    ],
  },
  {
    name: 'Pet-a-Pup',
    cardClass: 'petapup',
    localPath: '/whack-a-mole/dist/',
    remotePath: '/whack-a-mole/dist/',
    hasRoot: true,
    visualAssertions: [
      { selector: 'article', description: 'Game grid', checkVisible: true },
      { selector: 'section', description: 'Hole sections', checkCount: 9 },
      { selector: 'img', description: 'Game images loaded', checkVisible: true },
      { selector: 'button', description: 'Game buttons', checkVisible: true },
    ],
  },
  {
    name: 'USA Map',
    cardClass: 'usa',
    localPath: '/usa-react/dist/',
    remotePath: '/usa-react/',
    hasRoot: true,
    visualAssertions: [
      { selector: '.map-section', description: 'Map section', checkVisible: true },
      { selector: '.map-section svg', description: 'SVG map', checkVisible: true },
      { selector: '.states-list', description: 'States list', checkVisible: true },
      { selector: '.footer', description: 'Footer', checkVisible: true },
    ],
  },
  {
    name: 'Workouts',
    cardClass: 'workout',
    localPath: '/workouts/',
    remotePath: '/workouts/',
    hasRoot: false,
    visualAssertions: [
      { selector: 'h1', description: 'Page heading', checkVisible: true },
      { selector: '.workout-card, .week-card, [class*="workout"]', description: 'Workout content', checkVisible: true },
    ],
  },
  {
    name: 'Thanksgiving',
    cardClass: 'thanksgiving',
    localPath: '/thanksgiving/thanksgiving_interactive.html',
    remotePath: '/thanksgiving/thanksgiving_interactive.html',
    hasRoot: false,
    visualAssertions: [
      { selector: 'h1', description: 'Page heading', checkVisible: true },
      { selector: 'button, .task, [class*="timeline"]', description: 'Interactive elements', checkVisible: true },
    ],
  },
];
