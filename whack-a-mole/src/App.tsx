import { useEffect, useState } from 'react'
import GameControls from './components/GameControls'

import hole from './assets/hole.png'
import dog_a from './assets/dog_a.png'
import dog_b from './assets/dog_b.png'
import dog_c from './assets/dog_c.png'
import dog_d from './assets/dog_d.png'

const dogImages = [dog_a, dog_b, dog_c, dog_d]
const encouragingMessages = [
  "Good dog!",
  "Who's a good doggy?",
  "You're the best pup ever!",
  "Such a sweet pup!"
]

export default function App() {
  const [holes, setHoles] = useState<boolean[]>(Array(9).fill(true))
  const [dogTypes, setDogTypes] = useState<number[]>(Array(9).fill(0))
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string>("")
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false)

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
    const changeImg = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * holes.length)

      moleVisibility(randomIndex, false)
      setTimeout(() => moleVisibility(randomIndex, true), 600)
    }, 1000)

    return () => {
      clearInterval(changeImg)
    }
  }, [holes])

  const handleRestartGame = () => {
    // Reset game state
    setScore(0)
    setHoles(Array(9).fill(true))
    setDogTypes(Array(9).fill(0))
    setShowMessage(false)
    setCurrentMessage("")
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
        <h1 style={{ marginBottom: '10px', textAlign: 'center' }}>Pet-A-Pup</h1>
        {showMessage ? (
          <div style={{
            backgroundColor: 'rgba(255, 215, 0, 0.95)',
            color: '#333',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '15px',
            animation: 'fadeIn 0.2s ease',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {currentMessage}
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '5px', fontSize: '1.25rem', textAlign: 'center' }}>Score</h2>
            <h3 style={{ fontSize: '1.75rem', margin: '0 auto 15px auto', textAlign: 'center' }}>{score}</h3>
          </>
        )}
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
        <GameControls
          onRestartGame={handleRestartGame}
          onBackToMenu={handleBackToMenu}
          score={highScore}
        />
      </main>
    </div>
  )
}
