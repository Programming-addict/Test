# Login & Database Auth — Design Spec

**Date:** 2026-04-19

---

## Overview

Add Firebase Auth (email + password) to the app. When a user visits `/todos` without being logged in, the todo list is replaced by a sign-in / sign-up form on the same page. When logged in, todos are scoped to the user's `uid` and the header shows their email + a sign-out button.

---

## Auth Approach

**Firebase Auth + React Context (client-side only).** No server-side session, no middleware, no Firebase Admin SDK.

- `AuthProvider` wraps the app in `layout.tsx`, listens to `onAuthStateChanged`, and exposes `user`, `signIn`, `signUp`, and `signOut` via context.
- The todos page reads `user` from context: if `null`, renders `AuthForm`; if set, renders the normal todo UI.
- `useTodos` and `addTodo` receive `user.uid` so Firestore queries are scoped per-user.

---

## New Files

### `src/features/auth/context/AuthContext.tsx`
`"use client"` context. Wraps children with an `AuthProvider`. Exposes:
- `user: FirebaseUser | null` — the currently signed-in user (or `null` while loading)
- `loading: boolean` — `true` until the first `onAuthStateChanged` fires (prevents flash of login form on refresh)
- `signIn(email, password): Promise<void>` — calls `signInWithEmailAndPassword`, throws on error
- `signUp(email, password): Promise<void>` — calls `createUserWithEmailAndPassword`, throws on error
- `signOut(): Promise<void>` — calls Firebase `signOut`

Export `useAuth()` hook that calls `useContext(AuthContext)`.

### `src/features/auth/components/AuthForm.tsx`
`"use client"` component. A single card that toggles between **Sign in** and **Create account** modes via local state.

**Fields (Sign in mode):** Email, Password, Submit button ("Sign in"), toggle link ("No account? Create one").

**Fields (Sign up mode):** Email, Password, Submit button ("Create account"), toggle link ("Already have one? Sign in").

**Error handling:** Auth errors (wrong password, email already in use, weak password, user not found) are caught and displayed inline below the submit button as a small red muted message. The raw Firebase error code is mapped to a human-readable string.

**Loading state:** Submit button shows "Signing in…" / "Creating account…" and is disabled while the request is in-flight.

---

## Modified Files

### `src/lib/firebase.ts`
Add `getAuth` export:
```ts
import { getAuth } from "firebase/auth";
export const auth = getAuth(app);
```

### `src/app/layout.tsx`
Wrap children with `AuthProvider` inside (or outside) `ThemeProvider`:
```tsx
<ThemeProvider>
  <AuthProvider>{children}</AuthProvider>
</ThemeProvider>
```

### `src/app/todos/page.tsx`
- Import `useAuth`.
- If `loading`: render just the header (prevents flash of login form on refresh).
- If `!user`: render `<AuthForm />` in place of the todo list area (header stays visible).
- If `user`: render `<AuthenticatedTodos userId={user.uid} />` in place of the todo list area. Header shows `user.email` + "Sign out" button.
- `AuthenticatedTodos` is a small private component defined in the same file. It calls `useTodos(userId)` and renders `<TodoForm userId={userId} />` + `<TodoList todos={todos} />`. This avoids calling `useTodos` conditionally (which violates React's rules of hooks).

### `src/features/todos/hooks/useTodos.tsx`
Change signature from `userId?: string` (optional) to `userId: string` (required). Pass it to `subscribeTodos` so the Firestore query is always filtered by `userId`. This hook is only ever called from `AuthenticatedTodos`, which has a guaranteed `uid`.

### `src/features/todos/components/TodoForm.tsx`
Accept `userId: string` prop. Pass it to `addTodo` so new todos are stamped with the correct `userId`.

---

## Data Flow

```
onAuthStateChanged
      ↓
  AuthContext (user, loading)
      ↓
  todos/page.tsx
  ├── loading? → blank
  ├── !user?  → <AuthForm />
  └── user    → <TodoForm userId={uid} /> + <TodoList /> (useTodos(uid))
                                                   ↓
                                          subscribeTodos(uid)
                                          → Firestore: where("userId","==",uid)
```

---

## Error Message Mapping

| Firebase code | Shown to user |
|---|---|
| `auth/user-not-found` | No account with that email |
| `auth/wrong-password` | Incorrect password |
| `auth/email-already-in-use` | An account with that email already exists |
| `auth/weak-password` | Password must be at least 6 characters |
| `auth/invalid-email` | Invalid email address |
| *(any other)* | Something went wrong. Please try again. |

---

## Firestore Security Rules (manual step)

The `userId` field on todos is set by the client, so Firestore security rules should enforce it. This must be done in the Firebase console — it is **not** part of this code change.

Recommended rule:
```
match /todos/{todoId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
}
```

---

## Out of Scope
- Google / OAuth sign-in.
- Password reset / forgot password flow.
- Email verification.
- Profile page.
- Any change to the home page (`/`).
