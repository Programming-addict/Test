"use client";
import { useState } from "react";
import TodoForm from "../../features/todos/components/TodoForm";
import TodoList from "../../features/todos/components/TodoList";
import SettingsPanel from "../../features/settings/components/SettingsPanel";
import useTodos from "../../features/todos/hooks/useTodos";

export default function TodosPage() {
  const { todos } = useTodos();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen app-shell flex items-start justify-center py-12 px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="page-header">
          <div>
            <div className="page-eyebrow">{today}</div>
            <h1 className="page-title">Your Todos</h1>
          </div>
          <button
            className="icon-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            ⚙
          </button>
        </header>

        <TodoForm />
        <TodoList todos={todos} />
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
