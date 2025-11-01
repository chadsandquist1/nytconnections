import { Category } from '../types';

export async function loadPuzzleFromCSV(csvPath: string): Promise<Category[]> {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('CSV loaded, text length:', csvText.length);

    const lines = csvText.trim().split('\n');
    console.log('Total lines:', lines.length);

    const categories: Category[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(part => part.trim());
      console.log(`Line ${i}: ${parts.length} parts -`, parts);

      if (parts.length >= 6) {
        const category: Category = {
          name: parts[0],
          words: [parts[1], parts[2], parts[3], parts[4]],
          difficulty: parseInt(parts[5], 10) || 1,
        };
        categories.push(category);
        console.log('Added category:', category.name);
      } else {
        console.warn(`Line ${i} has ${parts.length} parts, expected 6`);
      }
    }

    console.log('Total categories parsed:', categories.length);

    if (categories.length !== 4) {
      throw new Error(`Expected 4 categories, but found ${categories.length}`);
    }

    return categories;
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
