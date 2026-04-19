"use client";
import { useState } from "react";
import { updateTodo, removeTodo } from "../services/todosService";

export default function TodoItem({ todo }: { todo: any }) {
  const [editing, setEditing] = useState(false);

  async function toggleComplete() {
    await updateTodo(todo.id, { completed: !todo.completed });
  }

  async function handleDelete() {
    await removeTodo(todo.id);
  }

  const reminderDate = todo.reminderAt
    ? new Date(todo.reminderAt.toDate?.() ?? todo.reminderAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      )
    : null;

  return (
    <div className={`todo-item${todo.completed ? " completed" : ""}`}>
      <button
        className={`todo-checkbox${todo.completed ? " checked" : ""}`}
        onClick={toggleComplete}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && "✓"}
      </button>

      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {(reminderDate || todo.notes) && (
          <div className="todo-meta">
            {reminderDate && <span>{reminderDate}</span>}
            {todo.notes && <span>{todo.notes}</span>}
          </div>
        )}
      </div>

      <div className="todo-actions">
        <button onClick={() => setEditing((s) => !s)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
