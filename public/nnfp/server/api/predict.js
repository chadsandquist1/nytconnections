import express from 'express';
import ExternalApiService from '../services/ExternalApiService.js';
import DataProcessingService from '../services/DataProcessingService.js';

const router = express.Router();

/**
 * GET /api/predict?reps=5000
 * NNFP Predict endpoint - returns picks data for Monte Carlo simulations
 * The actual simulation logic runs on the client side (in React)
 */
router.get('/', async (req, res) => {
  try {
    const reps = parseInt(req.query.reps) || 5000;

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

    // Return all data needed for predictions
    res.json({
      success: true,
      data: {
        week: picksData.week,
        picksTxt: picksData.rawText,
        grid: picksData.grid,
        players: picksData.players,
        matchups: picksData.matchups,
        mfl: mflData,
        odds: oddsMap,
        opps: oppsMap,
        results: results,
        reps: reps
      }
    });
  } catch (error) {
    console.error('Error in Predict endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
