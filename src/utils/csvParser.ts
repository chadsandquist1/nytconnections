import { Category, PuzzleData, Theme } from '../types';

export async function loadPuzzleFromCSV(csvPath: string): Promise<PuzzleData> {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const categories: Category[] = [];
    let completionMessage = 'Congratulations! 🎉';
    let title = 'Connections';
    let instructions = 'Find groups of four items that share something in common.';
    let theme: Theme = {
      primaryColor: '#5a594e',
      secondaryColor: '#000000',
      accentColor: '#f9df6d',
      backgroundImage: '',
    };
    let startIndex = 1; // Default: skip header row

    // Check for optional rows (CompletionMessage and Theme)
    for (let i = 1; i < lines.length && i < 3; i++) {
      const line = lines[i].trim();

      if (line.startsWith('CompletionMessage,')) {
        const parts = line.split(',').map(part => part.trim());

        if (parts.length === 2) {
          // Only message provided
          completionMessage = parts[1];
        } else if (parts.length === 3) {
          // Message and title provided
          completionMessage = parts[1];
          title = parts[2];
        } else if (parts.length >= 4) {
          // Message, title, and instructions provided
          if (parts.length === 4) {
            completionMessage = parts[1];
            title = parts[2];
            instructions = parts[3];
          } else {
            // Join all middle parts as the message
            completionMessage = parts.slice(1, parts.length - 2).join(', ');
            title = parts[parts.length - 2];
            instructions = parts[parts.length - 1];
          }
        }

        startIndex = i + 1;
      } else if (line.startsWith('Theme,')) {
        const parts = line.split(',').map(part => part.trim());

        if (parts.length >= 5) {
          theme = {
            primaryColor: parts[1] || theme.primaryColor,
            secondaryColor: parts[2] || theme.secondaryColor,
            accentColor: parts[3] || theme.accentColor,
            backgroundImage: parts[4] || theme.backgroundImage,
          };
        }

        startIndex = i + 1;
      }
    }

    // Parse category rows
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(part => part.trim());

      if (parts.length >= 6) {
        const category: Category = {
          name: parts[0],
          words: [parts[1], parts[2], parts[3], parts[4]],
          difficulty: parseInt(parts[5], 10) || 1,
        };
        categories.push(category);
      }
    }

    if (categories.length !== 4) {
      throw new Error(`Expected 4 categories, but found ${categories.length}`);
    }

    return {
      categories,
      completionMessage,
      title,
      instructions,
      theme,
    };
  } catch (error) {
    console.error('Error loading puzzle from CSV:', error);
    throw error;
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
