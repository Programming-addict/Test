"use client";
import { useState } from "react";
import { addTodo } from "../services/todosService";

export default function TodoForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const reminderAt = reminder ? new Date(reminder) : null;
    await addTodo({ title: title.trim(), notes: notes.trim(), reminderAt, userId });
    setTitle("");
    setNotes("");
    setReminder("");
    setExpanded(false);
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-form-row">
        <span className="todo-form-icon" aria-hidden="true" />
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setExpanded(true);
          }}
          onFocus={() => setExpanded(true)}
          placeholder="Add a task…"
          className="todo-form-input"
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </div>

      {expanded && (
        <div className="todo-form-extras">
          <input
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            type="datetime-local"
            className="todo-form-field"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="todo-form-field"
          />
        </div>
      )}
    </form>
  );
}
