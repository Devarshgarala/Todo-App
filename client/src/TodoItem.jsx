import React from 'react';

const escapeHtml = (unsafe) => {
  const div = document.createElement('div');
  div.textContent = unsafe;
  return div.innerHTML;
};

const TodoItem = ({ todo, toggleTodo, handleUpdate, deleteTodo }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <div className="todo-title">{todo.title}</div>
      </div>
      {todo.description && <div className="todo-description">{todo.description}</div>}
      <div className="todo-actions">
        <button
          className={`btn complete-btn ${todo.completed ? 'completed' : ''}`}
          onClick={() => toggleTodo(todo.id, !todo.completed)}
        >
          {todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          className="btn update-btn"
          onClick={() => handleUpdate(todo.id, todo.title, todo.description || '')}
        >
          Update
        </button>
        <button
          className="btn delete-btn"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
