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

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={!!todo.completed} onChange={toggleComplete} />
        <div>
          <div className={todo.completed ? "muted line-through" : ""}>{todo.title}</div>
          {todo.notes ? <div className="muted text-sm">{todo.notes}</div> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-ghost" onClick={() => setEditing((s) => !s)}>
          Edit
        </button>
        <button className="btn-ghost" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
