"use client";
import { useState } from "react";
import TodoForm from "../../features/todos/components/TodoForm";
import TodoList from "../../features/todos/components/TodoList";
import SettingsPanel from "../../features/settings/components/SettingsPanel";
import AuthForm from "../../features/auth/components/AuthForm";
import useTodos from "../../features/todos/hooks/useTodos";
import { useAuth } from "../../features/auth/context/AuthContext";

function AuthenticatedTodos({ userId }: { userId: string }) {
  const { todos } = useTodos(userId);
  return (
    <>
      <TodoForm userId={userId} />
      <TodoList todos={todos} />
    </>
  );
}

export default function TodosPage() {
  const { user, loading, signOut } = useAuth();
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user && (
              <>
                <span className="auth-user-email">{user.email}</span>
                <button className="btn-ghost" onClick={signOut}>
                  Sign out
                </button>
              </>
            )}
            <button
              className="icon-btn"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
            >
              ⚙
            </button>
          </div>
        </header>

        {loading ? null : user ? (
          <AuthenticatedTodos userId={user.uid} />
        ) : (
          <AuthForm />
        )}
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
