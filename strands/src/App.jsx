import { useState, useEffect } from 'react'
import Home from './components/Home'
import Play from './components/Play'
import { loadConfig, getGameData } from './utils/configLoader'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [config, setConfig] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
        setGameData(getGameData(loadedConfig));
      } catch (error) {
        console.error('Failed to initialize game:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, []);

  if (loading || !config || !gameData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#C0DDD9',
        color: '#000',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  const handleRestartGame = () => {
    // Reload the page to reset the game state
    window.location.reload();
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  return (
    <>
      {!gameStarted ? (
        <Home onStartGame={() => setGameStarted(true)} config={config} />
      ) : (
        <Play
          config={config}
          gameData={gameData}
          onRestartGame={handleRestartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </>
  )
}

export default App
