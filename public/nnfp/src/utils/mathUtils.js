/**
 * Mathematical utility functions
 * Migrated from legacy example.js
 */

/**
 * Generate a Gaussian (normal) distributed random number
 * Box-Muller transform implementation
 * @returns {number} Random number from standard normal distribution (mean=0, stddev=1)
 */
export function nextGaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Add nextGaussian to Math object for compatibility with legacy code
if (!Math.nextGaussian) {
  Math.nextGaussian = nextGaussian;
}

/**
 * Shuffle array in place (Fisher-Yates shuffle)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Calculate percentage
 * @param {number} value - Numerator
 * @param {number} total - Denominator
 * @returns {string} Percentage string (e.g., "75%")
 */
export function percentage(value, total) {
  if (total === 0) return '0%';
  const percent = Math.round((value * 100) / total);
  return `${percent}%`;
}

/**
 * Round to 2 decimal places
 * @param {number} num - Number to round
 * @returns {number} Rounded number
 */
export function round2(num) {
  return Math.round(num * 100) / 100;
}

/**
 * Pad number with leading space to width 4 (for display)
 * @param {string} str - String to pad
 * @returns {string} Padded string
 */
export function make4Front(str) {
  while (str.length < 4) {
    str = ' ' + str;
  }
  return str;
}

/**
 * Pad string to length 6 (for display)
 * @param {string} str - String to pad
 * @returns {string} Padded string
 */
export function make6(str) {
  while (str.length < 6) {
    str = str + ' ';
  }
  return str;
}

/**
 * Replace all occurrences in a string
 * @param {string} str - Input string
 * @param {string} find - String to find
 * @param {string} replace - Replacement string
 * @returns {string} Result string
 */
export function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

/**
 * Sort function for objects with single key-value pair (sorts by value, descending)
 * Used for player score arrays
 * @param {Object} a - First object
 * @param {Object} b - Second object
 * @returns {number} Comparison result
 */
export function sortByValFunctionRandom(a, b) {
  const valA = getOnlyVal(a);
  const valB = getOnlyVal(b);
  return valA - valB; // ascending order (lower score is better)
}

/**
 * Get the only key from an object with one key-value pair
 * @param {Object} obj - Object with single key
 * @returns {string} The key
 */
export function getOnlyKey(obj) {
  return Object.keys(obj)[0];
}

/**
 * Get the only value from an object with one key-value pair
 * @param {Object} obj - Object with single value
 * @returns {*} The value
 */
export function getOnlyVal(obj) {
  return obj[Object.keys(obj)[0]];
}

/**
 * Check if array contains an element
 * @param {*} element - Element to find
 * @param {Array} array - Array to search
 * @returns {boolean} True if found
 */
export function arrayContains(element, array) {
  return array.includes(element);
}

/**
 * Fetch object from array by key
 * @param {Array} array - Array of objects
 * @param {string} key - Key to find
 * @returns {Object} Found object or null
 */
export function fetchKeyInArray(array, key) {
  return array.find(obj => obj.hasOwnProperty(key)) || null;
}

/**
 * Increment counter in map
 * @param {Map|Object} map - Map to update
 * @param {string} key - Key to increment
 */
export function mapCounter(map, key) {
  if (map[key] === undefined) {
    map[key] = 1;
  } else {
    map[key]++;
  }
}

/**
 * Check if string has lowercase characters
 * @param {string} str - String to check
 * @returns {boolean} True if has lowercase
 */
export function hasLowercase(str) {
  return str !== str.toUpperCase();
}
