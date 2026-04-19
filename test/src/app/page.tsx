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
