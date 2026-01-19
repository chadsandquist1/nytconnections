import { useState } from 'react'
import { USAMap } from '@mirawision/usa-map-react'
import { statesData } from './statesData'
import './App.css'

function App() {
  const [selectedState, setSelectedState] = useState(null)

  const handleStateClick = (stateCode) => {
    setSelectedState(stateCode)
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      const element = document.getElementById(`state-${stateCode}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 50)
  }

  const handleStateNameClick = (stateName) => {
    // Open Wikipedia page in new tab
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(stateName)}`
    window.open(wikiUrl, '_blank', 'noopener,noreferrer')
  }

  // Create custom states configuration for the map
  const customStates = {}
  Object.keys(statesData).forEach(stateCode => {
    customStates[stateCode] = {
      fill: selectedState === stateCode ? '#b22234' : '#3c3b6e',
      onClick: () => handleStateClick(stateCode)
    }
  })

  return (
    <div className="app">
      <div className="map-section">
        <USAMap
          customStates={customStates}
          width="1000"
          height="600"
        />
      </div>

      <div className="states-list">
        <ul>
          {Object.entries(statesData)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([code, state]) => (
              <li
                key={code}
                id={`state-${code}`}
                className={selectedState === code ? 'selected' : ''}
              >
                <strong
                  className="state-name"
                  onClick={() => handleStateNameClick(state.name)}
                >
                  {state.name}
                </strong>
                <ul className="state-details">
                  <li>Population: {state.population}</li>
                  <li>Capital: {state.capital}</li>
                </ul>
              </li>
            ))}
        </ul>
      </div>

      <div className="footer">
        <h1>🇺🇸 USA Interactive Map 🇺🇸</h1>
        <p>Click on any state name to view Wikipedia • Click map to navigate</p>
        <a href="/" className="home-link">← Back to Home</a>
      </div>
    </div>
  )
}

export default App
