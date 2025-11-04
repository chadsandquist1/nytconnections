/**
 * Frontend API Service
 * Calls the Express backend (either local or Lambda)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetch NNFP picks and game data
 */
export async function fetchNnfpData() {
  const response = await fetch(`${API_BASE_URL}/api/nnfp`);
  if (!response.ok) {
    throw new Error(`Failed to fetch NNFP data: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data; // Extract the data field
}

/**
 * Fetch prediction data
 */
export async function fetchPredictData(reps = 5000) {
  const response = await fetch(`${API_BASE_URL}/api/predict?reps=${reps}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch predict data: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}

/**
 * Fetch spread data
 */
export async function fetchSpreadData(week) {
  const response = await fetch(`${API_BASE_URL}/api/spread?week=${week}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch spread data: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}
