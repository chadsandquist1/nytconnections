import mockData from '../data/jservice-api-responses.json'
import type { JeopardyClue, MockData } from '../types'

const typedMockData = mockData as unknown as MockData

/**
 * Mock implementation of the jService.io API
 * This eliminates the need for a backend server by using static JSON data
 */

/**
 * Simulates fetching categories from the API
 * @param count - Number of categories to return (default 6)
 * @param offset - Offset for pagination (used to select game board)
 * @returns Promise of array of category objects
 */
export const fetchCategories = async (count = 6, offset: number | null = null): Promise<{ id: number; title: string }[]> => {
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 100))

  // Randomly select a game board (or use offset to determine which one)
  const gameBoards = typedMockData.gameBoards
  const boardIndex = offset !== null ? offset % gameBoards.length : Math.floor(Math.random() * gameBoards.length)
  const selectedBoard = gameBoards[boardIndex]

  // Return the categories (limit to requested count)
  return selectedBoard.categories.slice(0, count)
}

/**
 * Simulates fetching clues for a specific category
 * @param categoryId - The category ID to fetch clues for
 * @returns Promise of array of clue objects
 */
export const fetchClues = async (categoryId: number): Promise<JeopardyClue[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50))

  // Find the game board that contains this category
  for (const board of typedMockData.gameBoards) {
    const cluesForCategory = board.clues[categoryId.toString()]
    if (cluesForCategory) {
      return cluesForCategory
    }
  }

  // Return empty array if category not found
  return []
}

interface MockResponse<T> {
  json: () => Promise<T>
}

/**
 * Mimics the original API endpoint structure
 * Usage: mockApi.get('/api/categories?count=6&offset=0')
 */
export const mockApi = {
  get: async <T>(url: string): Promise<MockResponse<T>> => {
    const urlObj = new URL(url, 'http://localhost')
    const path = urlObj.pathname
    const params = urlObj.searchParams

    if (path.includes('/categories')) {
      const count = parseInt(params.get('count') || '6')
      const offset = params.get('offset') ? parseInt(params.get('offset')!) : null
      return { json: async () => await fetchCategories(count, offset) as T }
    }

    if (path.includes('/clues')) {
      const categoryId = parseInt(params.get('category') || '0')
      return { json: async () => await fetchClues(categoryId) as T }
    }

    throw new Error(`Unknown endpoint: ${path}`)
  }
}

export default mockApi
