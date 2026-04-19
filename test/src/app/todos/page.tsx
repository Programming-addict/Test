"use client";
import TodoForm from "../../features/todos/components/TodoForm";
import TodoList from "../../features/todos/components/TodoList";
import useTodos from "../../features/todos/hooks/useTodos";

export default function TodosPage() {
  const { todos } = useTodos();

  return (
    <div className="min-h-screen app-shell flex items-start justify-center py-12 px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Todos</h1>
          <div className="muted">Black & White • Simple</div>
        </header>

        <TodoForm />

        <TodoList todos={todos} />
      </div>
    </div>
  );
}
