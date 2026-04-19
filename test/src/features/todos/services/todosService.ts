import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where,
  Timestamp,
} from "firebase/firestore";

type NewTodo = {
  title: string;
  notes?: string;
  dueAt?: Date | null;
  reminderAt?: Date | null;
};

const todosCol = collection(db, "todos");

export async function addTodo(payload: NewTodo & { userId?: string }) {
  const docRef = await addDoc(todosCol, {
    title: payload.title,
    notes: payload.notes || "",
    completed: false,
    dueAt: payload.dueAt ? Timestamp.fromDate(payload.dueAt) : null,
    reminderAt: payload.reminderAt ? Timestamp.fromDate(payload.reminderAt) : null,
    createdAt: serverTimestamp(),
    userId: payload.userId || null,
  });
  return docRef.id;
}

export async function updateTodo(id: string, patch: Partial<any>) {
  const d = doc(db, "todos", id);
  const payload: any = { ...patch };
  if (payload.dueAt instanceof Date) payload.dueAt = Timestamp.fromDate(payload.dueAt);
  if (payload.reminderAt instanceof Date) payload.reminderAt = Timestamp.fromDate(payload.reminderAt);
  return updateDoc(d, payload);
}

export async function removeTodo(id: string) {
  return deleteDoc(doc(db, "todos", id));
}

export function subscribeTodos(callback: (items: any[]) => void, userId?: string) {
  // userId query avoids orderBy to skip requiring a composite Firestore index;
  // sorting is done client-side in useTodos instead.
  const q = userId
    ? query(todosCol, where("userId", "==", userId))
    : query(todosCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function fetchUpcomingReminders(windowMs = 1000 * 60 * 60 * 24) {
  // fetch todos with reminderAt within the next window
  const now = Timestamp.fromDate(new Date());
  const future = Timestamp.fromDate(new Date(Date.now() + windowMs));
  const q = query(todosCol, where("reminderAt", ">=", now), where("reminderAt", "<=", future));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function showNotification(title: string, body?: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") new Notification(title, { body });
    });
  }
}
