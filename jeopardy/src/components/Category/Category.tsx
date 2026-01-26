import React from 'react'
import Clue from '../Clue/Clue'
import './Category.css'
import type { JeopardyCategory } from '../../types'

interface CategoryProps {
    category: JeopardyCategory;
}

const Category: React.FC<CategoryProps> = ({ category }) => {
    const values = [200, 400, 600, 800, 1000]

    const toTitleCase = (str: string): string => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    const title = toTitleCase(category.title)

    return (
        <div className="jeopardy-category">
            <h2>{title}</h2>
            {values.map((value, index) => {
                const clue = category.clues.find((clue) => clue.value === value)
                return <Clue key={index} value={value} clue={clue} />
            })}
        </div>
    )
}

export default Category
