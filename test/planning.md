# Todo App — Planning

## Vision
Build a minimal, attractive, black-and-white themed todo app using Next.js (app router), Firebase (Firestore) as the backend, and browser/service-worker notifications for reminders. Project will follow a feature-based structure and DRY principles.

## Major Features
- Core CRUD for todos (title, notes, due date, reminder)
- Per-item reminders and desktop notifications
- Firebase Firestore sync and simple auth-ready design
- Black & white theme with accessible typography and spacing

## Architecture
- Feature folder: `src/features/todos` contains UI, hooks, services.
- Firebase init in `src/lib/firebase.ts` (reads env vars `NEXT_PUBLIC_...`).
- Notifications: client-side Notification API for foreground; service worker + FCM stub for background push.

## Data model (Firestore `todos` collection)
- id: auto
- title: string
- notes: string
- completed: boolean
- dueAt: timestamp | null
- reminderAt: timestamp | null
- createdAt: timestamp

## Milestones
1. Project skeleton & theme (this repo) — complete
2. Firebase config + services — next
3. UI components + pages — next
4. Notifications & service-worker — next
5. Docs + testing — final

## Environment variables
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (optional for FCM)
- NEXT_PUBLIC_FIREBASE_APP_ID

## Reminders / Notifications
- Primary: schedule reminders in-browser when user is active (using Notification API).
- Background: provide `public/firebase-messaging-sw.js` stub and instructions to configure FCM server keys in `README`.

## Next steps for you
- Add Firebase project and set the `NEXT_PUBLIC_...` env vars.
- If background push is needed, configure FCM and add server to send messages.
