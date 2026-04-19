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
