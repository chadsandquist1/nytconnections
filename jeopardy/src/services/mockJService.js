import mockData from '../data/jservice-api-responses.json'

/**
 * Mock implementation of the jService.io API
 * This eliminates the need for a backend server by using static JSON data
 */

/**
 * Simulates fetching categories from the API
 * @param {number} count - Number of categories to return (default 6)
 * @param {number} offset - Offset for pagination (used to select game board)
 * @returns {Promise<Array>} Array of category objects
 */
export const fetchCategories = async (count = 6, offset = null) => {
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 100))

  // Randomly select a game board (or use offset to determine which one)
  const gameBoards = mockData.gameBoards
  const boardIndex = offset ? offset % gameBoards.length : Math.floor(Math.random() * gameBoards.length)
  const selectedBoard = gameBoards[boardIndex]

  // Return the categories (limit to requested count)
  return selectedBoard.categories.slice(0, count)
}

/**
 * Simulates fetching clues for a specific category
 * @param {number} categoryId - The category ID to fetch clues for
 * @returns {Promise<Array>} Array of clue objects
 */
export const fetchClues = async (categoryId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50))

  // Find the game board that contains this category
  for (const board of mockData.gameBoards) {
    const cluesForCategory = board.clues[categoryId.toString()]
    if (cluesForCategory) {
      return cluesForCategory
    }
  }

  // Return empty array if category not found
  return []
}

/**
 * Mimics the original API endpoint structure
 * Usage: mockApi.get('/api/categories?count=6&offset=0')
 */
export const mockApi = {
  get: async (url) => {
    const urlObj = new URL(url, 'http://localhost')
    const path = urlObj.pathname
    const params = urlObj.searchParams

    if (path.includes('/categories')) {
      const count = parseInt(params.get('count')) || 6
      const offset = parseInt(params.get('offset')) || null
      return { json: async () => await fetchCategories(count, offset) }
    }

    if (path.includes('/clues')) {
      const categoryId = parseInt(params.get('category'))
      return { json: async () => await fetchClues(categoryId) }
    }

    throw new Error(`Unknown endpoint: ${path}`)
  }
}

export default mockApi
