# React Jeopardy

A React-based Jeopardy game that allows you to play the classic quiz show game solo or with friends.

## Setup

### Install Dependencies

```bash
cd jeopardy
npm install
```

### Backend Server Setup

The app requires a backend server to proxy API requests:

```bash
cd backend
npm install
```

## Running the App

You need to run both the backend server and the frontend dev server:

### Terminal 1 - Backend Server
```bash
cd jeopardy/backend
npm start
```
This starts the server on `http://localhost:5000`

### Terminal 2 - Frontend Dev Server
```bash
cd jeopardy
npm run dev
```
This starts the Vite dev server (typically on `http://localhost:5173` or `http://localhost:5174`)

## How It Works

- The frontend makes requests to `/api/*` endpoints
- Vite's proxy forwards these to the backend server (`localhost:5000`)
- The backend proxies requests to the jservice.io API to avoid CORS issues

## Important Notes

⚠️ **API Status**: As of December 2025, jservice.io appears to be down/parked. The app may not work until:
- The jservice.io API comes back online, OR
- You implement an alternative data source (mock data, different API, etc.)

### Alternative Options

If jservice.io remains down:
1. **Use mock data**: Create sample jeopardy questions in JSON format
2. **Alternative API**: Find another Jeopardy/trivia API (Open Trivia DB, etc.)
3. **Build your own**: Create a custom dataset of jeopardy questions

## Build for Production

```bash
npm run build
```

This creates optimized static files in the `dist` folder.
