import React from "react";
import "./Home.css";

const Home = ({ onStartGame, config }) => {
  const homeConfig = config?.ui?.home || {};

  return (
    <main className="home-container">
      <div className="home-content">
        <h1 className="home-title">{homeConfig.title || "Strands"}</h1>
        <p className="home-subtitle">{homeConfig.subtitle || "Custom Edition"}</p>
        <p className="home-description">
          {homeConfig.description || "Find hidden words and uncover the day's theme"}
        </p>
        <button onClick={onStartGame} className="play-button">
          {homeConfig.playButtonText || "Play"}
        </button>
        <p className="home-info">{homeConfig.creditLine1 || "Designed in Edina"}</p>
        <p className="home-info">{homeConfig.creditLine2 || "Puzzle by Chad and Claude!"}</p>
      </div>
    </main>
  );
};

export default Home;
