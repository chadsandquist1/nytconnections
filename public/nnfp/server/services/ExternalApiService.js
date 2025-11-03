import axios from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * ExternalApiService - Compartmentalized API service layer
 *
 * This service handles all external API calls.
 * To replace the implementation later, simply modify the methods in this class
 * without touching any other code.
 */
class ExternalApiService {
  constructor() {
    this.USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
    this.CURRENT_YEAR = this.calculateYear();
  }

  /**
   * Calculate the current NFL season year
   * Uses the same logic as the original: (Date - 55 days).year
   */
  calculateYear() {
    const now = new Date();
    const adjusted = new Date(now.getTime() - (55 * 24 * 60 * 60 * 1000));
    return adjusted.getFullYear();
  }

  /**
   * Fetch NFL picks from Dropbox
   * @returns {Promise<string>} Raw picks text
   */
  async fetchPicks() {
    if (this.USE_MOCK_DATA) {
      const { getPicksMock } = await import('../mock/picksMock.js');
      return getPicksMock();
    }

    try {
      const randomParam = Math.floor(Math.random() * 1000000);
      const url = `https://www.dropbox.com/s/i9tomzuiummmpwt/picks.txt?dl=1&${randomParam}`;
      const response = await axios.get(url, { timeout: 10000 });

      if (!response.data || !response.data.includes('NNFP Week')) {
        throw new Error('Invalid picks data received');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching picks:', error.message);
      throw new Error(`Failed to fetch picks: ${error.message}`);
    }
  }

  /**
   * Fetch NFL schedule and scores from MyFantasyLeague API
   * Implements retry logic to get the most up-to-date data
   * @param {number} week - Week number
   * @param {number} attempts - Number of attempts to make
   * @param {number} successes - Number of successful responses needed
   * @returns {Promise<string>} XML response text
   */
  async fetchMflSchedule(week, attempts = 100, successes = 10) {
    if (this.USE_MOCK_DATA) {
      const { getMflScheduleMock } = await import('../mock/mflMock.js');
      return getMflScheduleMock(week);
    }

    const responseTexts = [];

    try {
      for (let i = 0; i < attempts && responseTexts.length < successes; i++) {
        const randomParam = Date.now() + Math.floor(Math.random() * 1000);
        const url = `https://api.myfantasyleague.com/${this.CURRENT_YEAR}/export?TYPE=nflSchedule&L=&W=${week}&whatever=${randomParam}`;

        try {
          const response = await axios.get(url, { timeout: 10000 });

          if (response.status === 200 && response.data) {
            responseTexts.push(response.data);
          }
        } catch (err) {
          // Continue on error, we're trying multiple times
          console.warn(`Attempt ${i + 1} failed:`, err.message);
        }
      }

      if (responseTexts.length === 0) {
        throw new Error(`Could not get valid response after ${attempts} attempts`);
      }

      // Return the response with the least time remaining (most up-to-date)
      const bestResponse = await this.selectMostCurrentResponse(responseTexts);
      return bestResponse;
    } catch (error) {
      console.error('Error fetching MFL schedule:', error.message);
      throw new Error(`Failed to fetch MFL schedule: ${error.message}`);
    }
  }

  /**
   * Select the most current response based on game time remaining
   * @param {Array<string>} responses - Array of XML responses
   * @returns {Promise<string>} The most current response
   */
  async selectMostCurrentResponse(responses) {
    const timeRemainingValues = [];

    for (const response of responses) {
      try {
        const parsed = await parseStringPromise(response);
        let totalTimeRemaining = 0;

        if (parsed.nflSchedule && parsed.nflSchedule.matchup) {
          for (const matchup of parsed.nflSchedule.matchup) {
            const remaining = parseInt(matchup.$.gameSecondsRemaining || 0);
            totalTimeRemaining += remaining;
          }
        }

        timeRemainingValues.push({ response, timeRemaining: totalTimeRemaining });
      } catch (err) {
        timeRemainingValues.push({ response, timeRemaining: 99999 });
      }
    }

    // Sort by time remaining and return the one with least time remaining
    timeRemainingValues.sort((a, b) => a.timeRemaining - b.timeRemaining);
    return timeRemainingValues[0].response;
  }

  /**
   * Fetch NFL odds/spreads from Gamblers Palace
   * @returns {Promise<string>} HTML response
   */
  async fetchOdds() {
    if (this.USE_MOCK_DATA) {
      const { getOddsMock } = await import('../mock/oddsMock.js');
      return getOddsMock();
    }

    try {
      const url = 'http://lines.gamblerspalace.com/';
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('Error fetching odds:', error.message);
      // Return empty string on error - odds are optional
      return '';
    }
  }

}

// Export singleton instance
export default new ExternalApiService();
