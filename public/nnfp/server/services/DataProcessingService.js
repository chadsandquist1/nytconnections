import { parseStringPromise } from 'xml2js';

/**
 * DataProcessingService - Handles all data parsing and transformation logic
 *
 * This service contains all the business logic for processing picks, MFL data,
 * and generating game state information.
 */
class DataProcessingService {
  /**
   * Team ID normalization mapping (MFL -> NNFP format)
   */
  static TEAM_NORMALIZE_MAP = {
    'JAX': 'JAC',
    'KCC': 'KC',
    'NOS': 'NO',
    'GBP': 'GB',
    'SFO': 'SF',
    'TBB': 'TB',
    'NEP': 'NE',
    'SDC': 'LAC',
    'ARZ': 'ARI',
    'AZ': 'ARI',
    'RAM': 'LAR',
    'LVR': 'LV',
    'OAK': 'LV',
  };

  /**
   * Normalize team ID to NNFP format
   * @param {string} teamId - Team ID to normalize
   * @returns {string} Normalized team ID
   */
  static normalizeTeamId(teamId) {
    const normalized = teamId.toUpperCase().trim();
    return this.TEAM_NORMALIZE_MAP[normalized] || normalized;
  }

  /**
   * Parse picks text and extract game data
   * @param {string} picksTxt - Raw picks text from Dropbox
   * @returns {Object} Parsed picks data
   */
  parsePicksText(picksTxt) {
    const lines = picksTxt.split('\n');
    const grid = {};
    const players = [];
    let week = 1;
    let matchups = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!line) continue;

      // Extract week number
      const weekMatch = line.match(/\((\d+)\)/);
      if (weekMatch) {
        week = parseInt(weekMatch[1]);
        continue;
      }

      // Skip header lines
      if (line.includes('NNFP') || line.includes('---')) {
        continue;
      }

      // Skip footer
      if (line.includes('MNT')) {
        break;
      }

      // Parse player names
      if (players.length === 0 && !this.stringContainsDigit(line)) {
        const playerNames = line.split(/\s+/).filter(p => p.trim().length > 0);
        playerNames.forEach(player => {
          players.push(player);
          grid[player] = {};
        });
        continue;
      }

      // Parse matchup lines (team + points)
      if (this.stringContainsDigit(line)) {
        const tokens = line.split(/\s+/).filter(t => t.trim().length > 0);

        const matchup = { teams: [], points: [] };
        let playerIndex = 0;

        for (let j = 0; j < tokens.length; j += 2) {
          if (j + 1 < tokens.length) {
            const team = tokens[j].toUpperCase();
            const points = tokens[j + 1];

            if (playerIndex < players.length) {
              grid[players[playerIndex]][team] = points;

              if (matchup.teams.length === 0) {
                matchup.teams.push(team);
              } else if (!matchup.teams.includes(team)) {
                matchup.teams.push(team);
              }

              playerIndex++;
            }
          }
        }

        if (matchup.teams.length > 0) {
          matchups.push(matchup);
        }
      }
    }

    return {
      week,
      players,
      grid,
      matchups,
      rawText: picksTxt
    };
  }

  /**
   * Check if string contains any digit
   * @param {string} str - String to check
   * @returns {boolean} True if contains digit
   */
  stringContainsDigit(str) {
    return /\d/.test(str);
  }

  /**
   * Convert MFL XML to JSON format
   * @param {string} xmlText - XML response from MFL API
   * @returns {Promise<Object>} Processed MFL data
   */
  async convertMflXmlToJson(xmlText) {
    try {
      const parsed = await parseStringPromise(xmlText);
      const mflData = {};
      const oddsMap = {};
      const oppsMap = {};

      if (!parsed.nflSchedule || !parsed.nflSchedule.matchup) {
        return { mflData, oddsMap, oppsMap };
      }

      for (const matchup of parsed.nflSchedule.matchup) {
        const teams = matchup.team || [];
        let prevTeam = null;
        let prevSpread = null;

        for (const team of teams) {
          const teamId = DataProcessingService.normalizeTeamId(team.$.id || '');
          const teamScore = parseInt(team.$.score || 0);
          const isHome = team.$.isHome || '0';
          const spreadString = team.$.spread || '0';
          const spread = parseFloat(spreadString);

          const secsRemaining = parseInt(matchup.$.gameSecondsRemaining || 0);

          // Add team data
          mflData[teamId] = {
            score: teamScore,
            remaining: secsRemaining,
            home: isHome === '1' ? 1 : 0,
            opp: null,
            oppScore: 0
          };

          // Handle opponent pairing
          if (prevTeam) {
            // Set opponent info
            mflData[teamId].opp = prevTeam;
            mflData[teamId].oppScore = mflData[prevTeam].score;
            mflData[prevTeam].opp = teamId;
            mflData[prevTeam].oppScore = teamScore;

            // Set odds
            oddsMap[teamId] = spread;
            oddsMap[prevTeam] = -spread;

            // Set opponents
            oppsMap[teamId] = prevTeam;
            oppsMap[prevTeam] = teamId;

            prevTeam = null;
          } else {
            prevTeam = teamId;
            prevSpread = spread;
          }
        }
      }

      return { mflData, oddsMap, oppsMap };
    } catch (error) {
      console.error('Error converting MFL XML:', error);
      throw new Error(`Failed to parse MFL XML: ${error.message}`);
    }
  }

  /**
   * Calculate current NFL results from MFL data
   * @param {Object} mflData - Processed MFL data
   * @returns {Object} Results categorized by winners, losers, ties, unknown
   */
  calculateNflResults(mflData) {
    const results = {
      winners: [],
      losers: [],
      ties: [],
      unknown: []
    };

    for (const [team, data] of Object.entries(mflData)) {
      // Game hasn't started or is in progress
      if (data.remaining > 0 || (data.remaining === 0 && data.score === 0 && data.oppScore === 0)) {
        results.unknown.push(team);
      }
      // Game is complete
      else if (data.remaining === 0) {
        if (data.score > data.oppScore) {
          results.winners.push(team);
        } else if (data.score < data.oppScore) {
          results.losers.push(team);
        } else {
          results.ties.push(team);
        }
      }
    }

    return results;
  }

  /**
   * Process spread data from MFL XML
   * @param {string} xmlText - XML response from MFL API
   * @param {number} week - Week number
   * @returns {Promise<Object>} Processed spread data
   */
  async processSpreadData(xmlText, week) {
    try {
      const parsed = await parseStringPromise(xmlText);
      const matchups = [];

      if (!parsed.nflSchedule || !parsed.nflSchedule.matchup) {
        return { week, matchups };
      }

      for (const matchup of parsed.nflSchedule.matchup) {
        const teams = matchup.team || [];

        if (teams.length >= 2) {
          const visitor = teams[0];
          const home = teams[1];

          const visitorId = DataProcessingService.normalizeTeamId(visitor.$.id || '');
          const homeId = DataProcessingService.normalizeTeamId(home.$.id || '');

          const homeSpreadString = home.$.spread || '0';
          const homeSpread = parseFloat(homeSpreadString);
          const visitorSpread = -homeSpread;

          // Determine favorite (team with lower spread)
          let favorite, opponent, spread, isHome;

          if (homeSpread < visitorSpread) {
            favorite = homeId;
            opponent = visitorId;
            spread = homeSpread;
            isHome = true;
          } else {
            favorite = visitorId;
            opponent = homeId;
            spread = visitorSpread;
            isHome = false;
          }

          matchups.push({
            visitor: visitorId,
            home: homeId,
            favorite,
            opponent,
            spread,
            isHome
          });
        }
      }

      // Sort by spread (lowest to highest)
      matchups.sort((a, b) => a.spread - b.spread);

      // Add ranks
      matchups.forEach((matchup, index) => {
        matchup.rank = index + 1;
      });

      return { week, matchups };
    } catch (error) {
      console.error('Error processing spread data:', error);
      throw new Error(`Failed to process spread data: ${error.message}`);
    }
  }
}

export default new DataProcessingService();
