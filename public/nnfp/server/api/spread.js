import express from 'express';
import ExternalApiService from '../services/ExternalApiService.js';
import DataProcessingService from '../services/DataProcessingService.js';

const router = express.Router();

/**
 * GET /api/spread?week=10
 * NFL Spreads endpoint - returns spread data for a given week
 */
router.get('/', async (req, res) => {
  try {
    const week = parseInt(req.query.week) || 1;

    // Fetch MFL schedule data
    const mflXml = await ExternalApiService.fetchMflSchedule(week);

    // Process spread data
    const spreadData = await DataProcessingService.processSpreadData(mflXml, week);

    res.json({
      success: true,
      data: spreadData
    });
  } catch (error) {
    console.error('Error in Spread endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
