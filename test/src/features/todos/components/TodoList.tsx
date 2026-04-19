"use client";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: any[] }) {
  if (!todos.length) {
    return <div className="card muted">No todos yet. Add one above.</div>;
  }

  return (
    <div className="card w-full max-w-3xl">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </div>
  );
}
