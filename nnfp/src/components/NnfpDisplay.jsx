import { useState, useEffect } from 'react';
import { fetchNnfpData } from '../services/apiService';

function NnfpDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const nnfpData = await fetchNnfpData();
      setData(nnfpData);
      setError(null);
    } catch (err) {
      console.error('Error loading NNFP data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        <div className="loading"></div>
        <p>Loading NNFP data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <strong>Error:</strong> {error}
        <br />
        <button onClick={loadData} style={{ marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Format the picks text for display (preserve spacing)
  const picksLines = data.picksTxt.split('\n');

  // Color code teams based on results
  const colorTeam = (teamName) => {
    if (data.results.winners.includes(teamName)) {
      return <span className="winner-color">{teamName}</span>;
    } else if (data.results.losers.includes(teamName)) {
      return <span className="loser-color">{teamName}</span>;
    } else if (data.results.ties.includes(teamName)) {
      return <span className="tie-color">{teamName}</span>;
    }
    return teamName;
  };

  // Parse a line and apply coloring
  const formatLine = (line) => {
    if (!line.trim() || line.includes('NNFP') || line.includes('---')) {
      return line;
    }

    // Split by whitespace and color each token
    const tokens = line.split(/(\s+)/);
    return tokens.map((token, idx) => {
      if (token.trim() && /^[A-Z]{2,}$/.test(token.trim())) {
        return <span key={idx}>{colorTeam(token)}</span>;
      }
      return token;
    });
  };

  return (
    <div>
      <div className="betaheader">
        <nobr>
          <i>NNFP latest results</i>&nbsp;&nbsp;&nbsp;
          <small>
            <small>
              <span title={new Date().getFullYear()}>WEEK {data.week}</span>
            </small>
          </small>
        </nobr>
      </div>
      <br />

      <div className="matchup">
        {picksLines.map((line, index) => (
          <div key={index}>
            {formatLine(line)}
            <br />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="normalfont">
          <strong>Legend:</strong>{' '}
          <span className="winner-color">Green = Winner</span>,{' '}
          <span className="loser-color">Red = Loser</span>,{' '}
          <span className="tie-color">Blue = Tie</span>
        </p>
      </div>

      <div className="mt-10">
        <p className="normalfont">
          <strong>Games Status:</strong>
          <br />
          Winners: {data.results.winners.length / 2} games completed
          <br />
          Unknown: {data.results.unknown.length / 2} games remaining
        </p>
      </div>

      <div className="mt-10">
        <button onClick={loadData}>Refresh Data</button>
      </div>
    </div>
  );
}

export default NnfpDisplay;
