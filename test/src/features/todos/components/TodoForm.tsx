"use client";
import { useState } from "react";
import { addTodo } from "../services/todosService";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const reminderAt = reminder ? new Date(reminder) : null;
    await addTodo({ title: title.trim(), notes: notes.trim(), reminderAt });
    setTitle("");
    setNotes("");
    setReminder("");
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-3xl">
      <div className="flex gap-3 items-start">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task"
          className="flex-1 p-3 bg-transparent border-b border-black/10 focus:outline-none"
        />
        <button className="btn-ghost">Add</button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <input
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          type="datetime-local"
          className="p-2 border rounded-lg"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="p-2 border rounded-lg"
        />
      </div>
    </form>
  );
}
