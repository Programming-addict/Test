# UI Polish & Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the todo app to an "Airy & Spacious" aesthetic and add a Settings slide-in panel with 4 selectable color themes (Mono, Sepia, Forest, Slate) persisted to localStorage.

**Architecture:** CSS custom properties (`--background`, `--foreground`, `--accent`, `--muted`, `--surface`, `--border`) drive all colors. A `data-theme` attribute on `<html>` activates theme overrides in `globals.css`. A React `ThemeProvider` context reads/writes localStorage and the attribute. A `SettingsPanel` component slides in from the right when the gear icon is clicked.

**Tech Stack:** Next.js 15 (App Router), React, Tailwind CSS v4, TypeScript, CSS custom properties, localStorage.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/globals.css` | Modify | All CSS variables, theme overrides, component styles |
| `src/features/settings/context/ThemeContext.tsx` | Create | ThemeProvider + useTheme hook |
| `src/app/layout.tsx` | Modify | Wrap children in ThemeProvider |
| `src/features/settings/components/SettingsPanel.tsx` | Create | Slide-in settings panel with theme switcher |
| `src/features/todos/components/TodoItem.tsx` | Modify | Circular checkbox, opacity for done, metadata line |
| `src/features/todos/components/TodoForm.tsx` | Modify | Merged single-row layout with optional extras |
| `src/features/todos/components/TodoList.tsx` | Modify | Remove card wrapper, use todo-list class |
| `src/app/todos/page.tsx` | Modify | Date eyebrow, gear icon, SettingsPanel wiring |
| `src/app/page.tsx` | Modify | Eyebrow, filled CTA, feature dot list |

---

## Task 1: CSS Variable Foundation

Replace `globals.css` entirely with the full theme system and all component styles. This is the foundation every subsequent task depends on.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

Write the following content to `src/app/globals.css` (replace the entire file):

```css
@import "tailwindcss";

/* === Base variables (Mono — default) === */
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #767676;
  --accent: #0a0a0a;
  --surface: #fafafa;
  --border: #f0f0f0;
}

/* === Theme: Sepia === */
[data-theme="sepia"] {
  --background: #fdf6e3;
  --foreground: #3b2f1e;
  --muted: #9a8070;
  --accent: #5c4a2a;
  --surface: #f5edd6;
  --border: #e8dfc8;
}

/* === Theme: Forest === */
[data-theme="forest"] {
  --background: #f2f9f2;
  --foreground: #1a3a1a;
  --muted: #6a956a;
  --accent: #2d6a2d;
  --surface: #e8f4e8;
  --border: #c0dfc0;
}

/* === Theme: Slate === */
[data-theme="slate"] {
  --background: #1e2433;
  --foreground: #dce3ef;
  --muted: #8090a8;
  --accent: #7c9cbf;
  --surface: #252d40;
  --border: #2e3650;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans, Arial, Helvetica, sans-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === Shared utilities === */
.app-shell {
  background: var(--background);
  color: var(--foreground);
}

.card {
  background: var(--surface);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--border);
}

.muted { color: var(--muted); }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-primary {
  background: var(--accent);
  color: var(--background);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

/* === Page layout === */
.page-eyebrow {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.page-title {
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.home-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.home-subtitle {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
  max-width: 480px;
}

.feature-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
  margin-bottom: 12px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--muted);
}

.feature-list li::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* === Icon button (gear) === */
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--foreground);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === Todo form === */
.todo-form {
  background: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.todo-form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}

.todo-form-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  display: block;
}

.todo-form-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--foreground);
}

.todo-form-input::placeholder {
  color: var(--muted);
}

.todo-form-extras {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px 14px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.todo-form-field {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--foreground);
  outline: none;
}

/* === Todo list === */
.todo-list {
  background: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.todo-empty {
  background: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 20px;
  color: var(--muted);
}

/* === Todo item === */
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  transition: opacity 0.15s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed {
  opacity: 0.4;
}

.todo-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--background);
  transition: background 0.15s, border-color 0.15s;
}

.todo-checkbox.checked {
  background: var(--accent);
  border-color: var(--accent);
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
}

.todo-meta {
  display: flex;
  gap: 8px;
  margin-top: 3px;
  font-size: 11px;
  color: var(--muted);
}

.todo-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.todo-actions button {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.todo-actions button:hover {
  color: var(--foreground);
}

/* === Settings panel === */
.settings-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 40;
}

.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 260px;
  background: var(--background);
  border-left: 1px solid var(--border);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 50;
  padding: 24px;
  transform: translateX(100%);
  transition: transform 0.25s ease;
}

.settings-panel.open {
  transform: translateX(0);
}

.settings-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.settings-panel-header span {
  font-weight: 600;
  font-size: 15px;
}

.settings-panel-header button {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--muted);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.settings-section-label {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 10px;
}

.settings-theme-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-theme-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--foreground);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  width: 100%;
}

.settings-theme-row:hover {
  background: var(--surface);
  border-color: var(--border);
}

.settings-theme-row.active {
  background: var(--accent);
  color: var(--background);
  border-color: var(--accent);
}

.settings-theme-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1.5px solid rgba(128, 128, 128, 0.3);
  display: inline-block;
}
```

- [ ] **Step 2: Verify dev server starts without CSS errors**

```bash
cd test && npm run dev
```

Open http://localhost:3000 — page should load (may look unstyled for component classes not yet used). No console errors. Stop the server (`Ctrl+C`).

- [ ] **Step 3: Commit**

```bash
git add test/src/app/globals.css
git commit -m "style: add CSS variable theme system and airy component styles"
```

---

## Task 2: ThemeContext

Create the context that manages theme state, localStorage persistence, and the `data-theme` attribute on `<html>`.

**Files:**
- Create: `src/features/settings/context/ThemeContext.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p test/src/features/settings/context
```

Write `src/features/settings/context/ThemeContext.tsx`:

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "mono" | "sepia" | "forest" | "slate";

export const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "mono",   label: "Mono",   color: "#0a0a0a" },
  { id: "sepia",  label: "Sepia",  color: "#5c4a2a" },
  { id: "forest", label: "Forest", color: "#2d6a2d" },
  { id: "slate",  label: "Slate",  color: "#1e2433" },
];

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "mono", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("mono");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEMES.find((t) => t.id === stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/features/settings/context/ThemeContext.tsx
git commit -m "feat: add ThemeProvider context with localStorage persistence"
```

---

## Task 3: Wire ThemeProvider into Layout

Wrap the app's root layout with `ThemeProvider` so every page has theme state available.

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Replace the contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../features/settings/context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A minimal todo app with reminders and Firebase sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/app/layout.tsx
git commit -m "feat: wrap root layout with ThemeProvider"
```

---

## Task 4: SettingsPanel Component

Slide-in panel from the right. Contains theme switcher rows. Controlled via `isOpen`/`onClose` props.

**Files:**
- Create: `src/features/settings/components/SettingsPanel.tsx`

- [ ] **Step 1: Create directory and file**

```bash
mkdir -p test/src/features/settings/components
```

Write `src/features/settings/components/SettingsPanel.tsx`:

```tsx
"use client";
import { THEMES, useTheme } from "../context/ThemeContext";

export default function SettingsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {isOpen && (
        <div
          className="settings-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`settings-panel${isOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        <div className="settings-panel-header">
          <span>Settings</span>
          <button onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </div>

        <div className="settings-section-label">Theme</div>

        <div className="settings-theme-list">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`settings-theme-row${theme === t.id ? " active" : ""}`}
              onClick={() => setTheme(t.id)}
            >
              <span
                className="settings-theme-swatch"
                style={{ background: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/features/settings/components/SettingsPanel.tsx
git commit -m "feat: add SettingsPanel slide-in component with theme switcher"
```

---

## Task 5: Polish TodoItem

Circular checkbox button, opacity for completed state, metadata line for reminder and notes.

**Files:**
- Modify: `src/features/todos/components/TodoItem.tsx`

- [ ] **Step 1: Replace TodoItem.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/features/todos/components/TodoItem.tsx
git commit -m "feat: polish TodoItem with circular checkbox and metadata line"
```

---

## Task 6: Polish TodoForm

Single-row layout with inline Add button. Reminder/notes fields expand below when the user starts typing.

**Files:**
- Modify: `src/features/todos/components/TodoForm.tsx`

- [ ] **Step 1: Replace TodoForm.tsx**

```tsx
"use client";
import { useState } from "react";
import { addTodo } from "../services/todosService";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const reminderAt = reminder ? new Date(reminder) : null;
    await addTodo({ title: title.trim(), notes: notes.trim(), reminderAt });
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/features/todos/components/TodoForm.tsx
git commit -m "feat: polish TodoForm with single-row layout and expandable extras"
```

---

## Task 7: Polish TodoList

Remove the `.card` wrapper — the new `.todo-list` class from globals.css handles the container styling. Update the empty state class.

**Files:**
- Modify: `src/features/todos/components/TodoList.tsx`

- [ ] **Step 1: Replace TodoList.tsx**

```tsx
"use client";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: any[] }) {
  if (!todos.length) {
    return <div className="todo-empty">No todos yet. Add one above.</div>;
  }

  return (
    <div className="todo-list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/features/todos/components/TodoList.tsx
git commit -m "feat: polish TodoList with todo-list container class"
```

---

## Task 8: Polish Todos Page

Add date eyebrow to header, wire the gear icon to open `SettingsPanel`.

**Files:**
- Modify: `src/app/todos/page.tsx`

- [ ] **Step 1: Replace todos/page.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add test/src/app/todos/page.tsx
git commit -m "feat: polish todos page header with date eyebrow and settings gear"
```

---

## Task 9: Polish Home Page

Add eyebrow label, upgrade CTA to filled button, replace bullet list with dot markers.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen app-shell flex items-center justify-center px-6 py-12">
      <main className="w-full max-w-3xl space-y-10">
        <section className="space-y-6">
          <div className="page-eyebrow">Todo App</div>
          <h1 className="home-title">A Minimal Todo App</h1>
          <p className="home-subtitle">
            Simple, focused todo list with reminders and optional Firebase sync.
            Designed for clarity and fast interactions — no distractions, just
            your tasks.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/todos" className="btn-primary">
              Open Todos →
            </Link>
            <a href="/planning.md" className="btn-ghost">
              Project Plan
            </a>
          </div>
        </section>

        <div className="card">
          <div className="feature-label">Features</div>
          <ul className="feature-list">
            <li>CRUD todos with notes, due date, and reminders</li>
            <li>In-browser notifications; optional background FCM push</li>
            <li>Firestore sync — easy to add your Firebase project</li>
            <li>Accessible design, mobile-first</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Final visual verification**

```bash
cd test && npm run dev
```

Check the following:

1. **http://localhost:3000** — Home page: eyebrow "TODO APP" visible, filled black "Open Todos →" button, feature list with dot markers
2. **http://localhost:3000/todos** — Todos page: date eyebrow (e.g. "SATURDAY, APR 19"), gear icon top-right, circular add form row
3. **Click gear icon** — Settings panel slides in from right, backdrop dims page, 4 theme rows visible (Mono, Sepia, Forest, Slate)
4. **Click Sepia** — page background shifts to warm paper color, gear panel stays open
5. **Click Forest** — page shifts to green tones
6. **Click Slate** — page shifts to dark navy
7. **Click Mono** — returns to white/black
8. **Refresh page** — selected theme persists (check localStorage in DevTools → Application → Local Storage)
9. **Click backdrop** — panel closes
10. **Add a todo** — click in form, extras expand; submit; item appears with circular checkbox
11. **Check a todo** — checkbox fills with accent color, item fades to 0.4 opacity

- [ ] **Step 4: Commit**

```bash
git add test/src/app/page.tsx
git commit -m "feat: polish home page with eyebrow, filled CTA, and feature dot list"
```

---

## Done

All 9 tasks complete. The app now has:
- 4 color themes switchable from the Settings panel, persisted to localStorage
- Airy & Spacious UI across both pages
- Slide-in Settings panel with backdrop dismiss
