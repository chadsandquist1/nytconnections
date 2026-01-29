import { useState } from 'react';
import { BackToHome } from './components/BackToHome';

interface Todo {
  id: number;
  text: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue.trim() }]);
      setInputValue('');
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const resetTodos = () => {
    setTodos([]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1 className="todo-title">TODO App</h1>

        <div className="input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="add-button" onClick={addTodo}>
            Add
          </button>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-text">{todo.text}</span>
              <button className="remove-button" onClick={() => removeTodo(todo.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <BackToHome
          showBackButton={true}
          showRestartButton={true}
          backLabel="Return to Menu"
          restartLabel="Reset"
          onRestart={resetTodos}
          position="bottom"
        />
      </div>
    </div>
  );
}

export default App;
