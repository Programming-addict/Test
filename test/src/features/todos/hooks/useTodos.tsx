"use client";
import { useEffect, useState, useRef } from "react";
import { subscribeTodos, showNotification } from "../services/todosService";

export default function useTodos(userId: string) {
  const [todos, setTodos] = useState<any[]>([]);
  const timeouts = useRef<Record<string, any>>({});

  useEffect(() => {
    const unsub = subscribeTodos((items) => {
      setTodos(items as any[]);
    }, userId);
    return () => unsub();
  }, [userId]);

  useEffect(() => {
    Object.values(timeouts.current).forEach((t) => clearTimeout(t));
    timeouts.current = {};
    todos.forEach((t) => {
      if (!t.reminderAt || t.completed) return;
      const ts = t.reminderAt.seconds
        ? t.reminderAt.seconds * 1000
        : new Date(t.reminderAt).getTime();
      const delay = ts - Date.now();
      if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 7) {
        timeouts.current[t.id] = setTimeout(() => {
          showNotification(t.title || "Reminder", t.notes || "");
        }, delay);
      }
    });
    return () => {
      Object.values(timeouts.current).forEach((t) => clearTimeout(t));
    };
  }, [todos]);

  return { todos };
}
