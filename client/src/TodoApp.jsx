import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

const API_BASE = 'http://localhost:5000'; 

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (editingTodoId) {
      alert('Save or cancel current edit first.');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a todo title');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        loadTodos();
      } else {
        alert('Error adding todo');
      }
    } catch (err) {
      alert('Error adding todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      loadTodos();
    } catch {
      alert('Error toggling todo');
    }
  };

  const handleUpdate = (id, currentTitle, currentDesc) => {
    setEditingTodoId(id);
    setTitle(currentTitle);
    setDescription(currentDesc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveUpdate = async () => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return;
    }

    try {
      await fetch(`${API_BASE}/todos/${editingTodoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      cancelEdit();
      loadTodos();
    } catch {
      alert('Error saving update');
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingTodoId(null);
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    } catch {
      alert('Error deleting todo');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>My Todo App</h1>
      </div>

      <div className="add-todo">
        <div className="input-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
          />
        </div>
        <textarea
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="button-group">
          {!editingTodoId ? (
            <button className="add-btn" onClick={addTodo}>Add Todo</button>
          ) : (
            <>
              <button className="add-btn update-mode-btn" style={{ background: '#f59e0b' }} onClick={saveUpdate}>Save Changes</button>
              <button className="add-btn cancel-btn" style={{ background: '#6b7280' }} onClick={cancelEdit}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div className="todos-container">
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet!</h3>
            <p>Add your first todo above to get started</p>
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              handleUpdate={handleUpdate}
              deleteTodo={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoApp;
