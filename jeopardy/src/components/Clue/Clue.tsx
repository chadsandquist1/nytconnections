import React, { useState } from 'react'
import './Clue.css'
import type { JeopardyClue } from '../../types'

interface ClueProps {
    value: number;
    clue: JeopardyClue | undefined;
}

const Clue: React.FC<ClueProps> = ({ value, clue }) => {
    const [stage, setStage] = useState(0)
    const [toggle, setToggle] = useState(false)

    const handleClick = () => {
        setStage(stage + 1)
        setToggle(true)
    }

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation()
        setStage(0)
        setToggle(false)
    }

    let content: React.ReactNode
    let className: string
    if (stage === 0) {
        content = `$${value}`
        className = `jeopardy-clue dollar-value`
    } else if (stage === 1) {
        content = <p className='jeopardy-clue-container'>{clue ? clue.question : null}</p>
        className = `jeopardy-clue`
    } else {
        content = <p>{clue ? clue.answer : null}</p>
        className = `jeopardy-clue`
    }

    return (
        <div className={className} style={{
            perspective: toggle ? '7em' : undefined,
            position: 'relative'
            }}
            onClick={handleClick}
        >
            { content }
            {stage > 0 && (
                <button
                    className="reset-button"
                    onClick={handleReset}
                    aria-label="Reset clue"
                >
                    ↺
                </button>
            )}
        </div>
    )
}

export default Clue
