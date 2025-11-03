import express from 'express';
import ExternalApiService from '../services/ExternalApiService.js';
import DataProcessingService from '../services/DataProcessingService.js';

const router = express.Router();

/**
 * GET /api/nnfp
 * Main NNFP endpoint - returns picks and game data
 */
router.get('/', async (req, res) => {
  try {
    // Fetch picks from Dropbox
    const picksTxt = await ExternalApiService.fetchPicks();

    // Parse picks
    const picksData = DataProcessingService.parsePicksText(picksTxt);

    // Fetch MFL schedule data
    const mflXml = await ExternalApiService.fetchMflSchedule(picksData.week);

    // Convert MFL XML to JSON
    const { mflData, oddsMap, oppsMap } = await DataProcessingService.convertMflXmlToJson(mflXml);

    // Calculate current results
    const results = DataProcessingService.calculateNflResults(mflData);

    // Return all data
    res.json({
      success: true,
      data: {
        week: picksData.week,
        picksTxt: picksData.rawText,
        grid: picksData.grid,
        players: picksData.players,
        matchups: picksData.matchups,
        mfl: mflData,
        mflXml: mflXml,
        odds: oddsMap,
        opps: oppsMap,
        results: results
      }
    });
  } catch (error) {
    console.error('Error in NNFP endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
