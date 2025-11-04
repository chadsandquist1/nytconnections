# NNFP - Neumann NFL Picks

A React-based NFL fantasy football picks management and analytics system, migrated from the legacy Gaelyk/Groovy application.

## Features

- **NNFP Picks Tracker**: Real-time tracking of weekly NFL picks with live scoring
- **NNFP Predict**: Monte Carlo simulation-based win probability projections
- **NFL Spreads Display**: Weekly point spreads and team rankings
- **Pebble Smartwatch Integration**: Card-based notifications and updates

## Architecture

### Frontend
- **React 19** with Vite for fast development
- **CSS**: Migrated from legacy Bootstrap 3 styling, preserving monospace fonts and color scheme
- **Components**: Modular React components for each feature

### Backend
- **Express.js** server acting as API proxy
- **Compartmentalized API Service Layer**: Easy to replace external API implementations
- **Mock Data Support**: Development mode with mock data (no external API calls)

### External APIs (Proxied through Express)
- MyFantasyLeague API: NFL schedules and scores
- Dropbox: Picks configuration and override data
- Gamblers Palace: NFL odds/spreads (optional)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env as needed
```

### Development

Run both frontend and backend together:
```bash
npm run dev
```

This starts:
- Express backend on `http://localhost:3001`
- Vite dev server on `http://localhost:5173`

Run separately:
```bash
npm run server  # Backend only
npm run client  # Frontend only
```

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

## Environment Variables

See `.env.example` for all available options:

- `PORT`: Express server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `USE_MOCK_DATA`: Use mock data instead of real API calls (default: true)

## API Endpoints

### Backend API (http://localhost:3001/api)

- `GET /api/health` - Health check
- `GET /api/nnfp` - Main NNFP picks and game data
- `GET /api/predict?reps=5000` - Prediction data for Monte Carlo simulations
- `GET /api/spread?week=10` - NFL spreads for a given week
- `GET /api/pebble` - Pebble smartwatch card content

## Development Notes

### Mock Data Mode

By default, the application uses mock data (`USE_MOCK_DATA=true` in `.env`). This allows development without making external API calls.

To use real API data, set `USE_MOCK_DATA=false` in `.env`.

### Replacing External APIs

All external API calls are centralized in `server/services/ExternalApiService.js`. To change API providers:

1. Modify methods in `ExternalApiService.js`
2. Keep the method signatures the same
3. No other code changes needed

## Deployment (AWS Serverless)

The application is designed to be deployed as:
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS Lambda with Function URLs (see terraform/ directory)

This provides a simple, cost-effective serverless deployment.
