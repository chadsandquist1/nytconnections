import React, { useEffect, useState } from 'react'
import Category from '../Category/Category.jsx'
import './Board.css'
import { fetchCategories, fetchClues } from '../../services/mockJService.js'

function Board() {
    const [categories, setCategories] = useState([]);
    const [currentBoard, setCurrentBoard] = useState(0);

    // Function to load a specific game board
    const loadBoard = async (boardIndex) => {
        // Fetch the categories from the mock service
        const categoryData = await fetchCategories(6, boardIndex);

        // Fetch the clues for each category.
        const categoriesWithClues = await Promise.all(categoryData.map(async (category) => {
            const clueData = await fetchClues(category.id);

            // Attach the clues to the category.
            return {
                ...category,
                clues: clueData,
            };
        }));

        setCategories(categoriesWithClues);
        setCurrentBoard(boardIndex);
    }

    // Load initial board (random)
    useEffect(() => {
        const randomBoard = Math.floor(Math.random() * 3);
        loadBoard(randomBoard);
    }, []);

    // Navigate to previous board
    const handlePreviousBoard = () => {
        const prevBoard = currentBoard === 0 ? 2 : currentBoard - 1;
        loadBoard(prevBoard);
    }

    // Navigate to next board
    const handleNextBoard = () => {
        const nextBoard = (currentBoard + 1) % 3;
        loadBoard(nextBoard);
    }

    // Load a new random board
    const handleNewGame = () => {
        const randomBoard = Math.floor(Math.random() * 3);
        loadBoard(randomBoard);
    }

    return (
        <div>
            <div className="board-controls">
                <button className="nav-button" onClick={handlePreviousBoard}>
                    ← Previous Board
                </button>
                <div className="board-info">
                    Game Board {currentBoard + 1} of 3
                </div>
                <button className="nav-button" onClick={handleNextBoard}>
                    Next Board →
                </button>
            </div>
            <div className="new-game-container">
                <button className="new-game-button" onClick={handleNewGame}>
                    🎲 New Random Game
                </button>
            </div>
            <div className="jeopardy-board">
                {categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}

export default Board;