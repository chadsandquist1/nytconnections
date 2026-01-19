import React from 'react'
import './GameControls.css'

interface GameControlsProps {
  onRestartGame: () => void
  onBackToMenu: () => void
  score: number
}

const GameControls: React.FC<GameControlsProps> = ({ onRestartGame, onBackToMenu, score }) => {
  return (
    <div className="game-controls-container">
      <div className="navigation-buttons">
        <button onClick={onBackToMenu} className="nav-button back-to-menu">
          ← Back to Menu
        </button>
        <button onClick={onRestartGame} className="nav-button restart-game">
          ↻ Restart Game
        </button>
      </div>
      <div className="score-display">
        <p>High Score: {score}</p>
      </div>
    </div>
  )
}

export default GameControls
