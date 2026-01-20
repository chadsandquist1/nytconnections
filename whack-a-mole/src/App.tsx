import { useEffect, useState } from 'react'
import GameControls from './components/GameControls'

import hole from './assets/hole.png'
import dog_a from './assets/dog_a.png'
import dog_b from './assets/dog_b.png'
import dog_c from './assets/dog_c.png'
import dog_d from './assets/dog_d.png'
import dog_e from './assets/dog_e.png'
import dog_f from './assets/dog_f.png'

const dogImages = [dog_a, dog_b, dog_c, dog_d, dog_e, dog_f]
const encouragingMessages = [
  "Good dog!",
  "Who's a good doggy?",
  "You're the best pup ever!",
  "Such a sweet pup!",
  "Good puppy gets a treat!",
  "Belly rubs for you!",
  "Awww, such a nice puppy!",
  "We love our pup!"
]

const GAME_DURATION = 60

export default function App() {
  const [holes, setHoles] = useState<boolean[]>(Array(9).fill(true))
  const [dogTypes, setDogTypes] = useState<number[]>(Array(9).fill(0))
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string>("")
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameEnded, setGameEnded] = useState<boolean>(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_DURATION)

  // Preload all images
  useEffect(() => {
    const imagesToPreload = [hole, ...dogImages]

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })
    }

    Promise.all(imagesToPreload.map(preloadImage))

      .then(() => {
        setImagesLoaded(true)
      })
      .catch((error) => {
        console.error('Error preloading images:', error)
        // Still set to true to allow game to start even if preload fails
        setImagesLoaded(true)
      })
  }, [])

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
    }
  }, [score, highScore])

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameEnded) return

    if (timeRemaining <= 0) {
      setGameEnded(true)
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameEnded, timeRemaining])

  function moleVisibility(index: number, visible: boolean) {
    setHoles(currentHoles => {
      const newHoles = [...currentHoles]

      newHoles[index] = visible

      return newHoles
    })

    if (!visible) {
      setDogTypes(currentDogs => {
        const newDogs = [...currentDogs]
        newDogs[index] = Math.floor(Math.random() * dogImages.length)
        return newDogs
      })
    }
  }

  function crushMole(index: number, event?: React.MouseEvent | React.TouchEvent) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Don't allow clicks if game hasn't started or has ended
    if (!gameStarted || gameEnded) return
    if (holes[index]) return
    moleVisibility(index, true)
    setScore(prevScore => prevScore + 1)

    // Show random encouraging message
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
    setCurrentMessage(randomMessage)
    setShowMessage(true)

    // Hide message after 750ms
    setTimeout(() => {
      setShowMessage(false)
    }, 750)
  }

  useEffect(() => {
    // Only run mole appearance when game is active
    if (!gameStarted || gameEnded) return

    const changeImg = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * holes.length)

      moleVisibility(randomIndex, false)
      setTimeout(() => moleVisibility(randomIndex, true), 600)
    }, 1000)

    return () => {
      clearInterval(changeImg)
    }
  }, [holes, gameStarted, gameEnded])

  const handleRestartGame = () => {
    // Reset game state
    setScore(0)
    setHoles(Array(9).fill(true))
    setDogTypes(Array(9).fill(0))
    setShowMessage(false)
    setCurrentMessage("")
    setTimeRemaining(GAME_DURATION)
    setGameEnded(false)
    setGameStarted(true)
  }

  const handleStartGame = () => {
    setGameStarted(true)
    setGameEnded(false)
    setScore(0)
    setTimeRemaining(GAME_DURATION)
    setHoles(Array(9).fill(true))
  }

  const handlePlayAgain = () => {
    setScore(0)
    setHoles(Array(9).fill(true))
    setDogTypes(Array(9).fill(0))
    setShowMessage(false)
    setCurrentMessage("")
    setTimeRemaining(GAME_DURATION)
    setGameEnded(false)
    setGameStarted(true)
  }

  const handleBackToMenu = () => {
    // Navigate to the root home page
    window.location.href = '/'
  }

  if (!imagesLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#fff'
      }}>
        Loading game...
      </div>
    )
  }

  return (
    <div>
      <main>
        {showMessage ? (
          <div style={{
            backgroundColor: 'rgba(255, 215, 0, 0.95)',
            color: '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '6px',
            animation: 'fadeIn 0.2s ease',
            flexShrink: 0
          }}>
            {currentMessage}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '6px',
            flexShrink: 0
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1>Score</h1>
              <h2>{score}</h2>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1>Time</h1>
              <h2 style={{ color: timeRemaining <= 10 ? '#ff6b6b' : 'inherit' }}>{timeRemaining}</h2>
            </div>
          </div>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          <article>
          {holes.map((isHole, index) => (
            <section
              key={index}
              onClick={(e) => crushMole(index, e)}
              onTouchStart={(e) => crushMole(index, e)}
            >
              <img
                src={isHole ? hole : dogImages[dogTypes[index]]}
                alt={isHole ? "hole" : "dog"}
                draggable="false"
              />
            </section>
          ))}
          </article>

          {/* Start Game Overlay */}
          {!gameStarted && !gameEnded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              zIndex: 10
            }}>
              <h2 style={{ marginBottom: '12px', fontSize: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Pet-a-Pup!</h2>
              <p style={{ marginBottom: '16px', textAlign: 'center', padding: '0 16px', fontSize: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                Pet as many pups as you can in 60 seconds!
              </p>
              <button
                onClick={handleStartGame}
                style={{
                  padding: '14px 36px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transition: 'transform 0.1s ease, background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* End Game Modal */}
        {gameEnded && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div style={{
              backgroundColor: '#333',
              padding: '24px 32px',
              borderRadius: '16px',
              textAlign: 'center',
              maxWidth: '85%',
              animation: 'fadeIn 0.3s ease'
            }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '12px', color: '#FFD700' }}>
                Good doggy!
              </h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                You scored {score}
              </p>
              <button
                onClick={handlePlayAgain}
                style={{
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease, background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <GameControls
          onRestartGame={handleRestartGame}
          onBackToMenu={handleBackToMenu}
          score={highScore}
        />
      </main>
    </div>
  )
}
