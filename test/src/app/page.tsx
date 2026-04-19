import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen app-shell flex items-center justify-center px-6 py-12">
      <main className="w-full max-w-5xl grid grid-cols-2 gap-12 items-center">
        <section className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">A Minimal Todo App — Black & White</h1>
          <p className="text-lg muted max-w-xl">
            Simple, focused todo list with reminders and optional Firebase sync. Designed for clarity and
            fast interactions — no distractions, just your tasks.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/todos" className="btn-ghost rounded-lg px-6 py-3">
              Open Todos
            </Link>
            <a href="/planning.md" className="btn-ghost rounded-lg px-4 py-3 muted">
              Project Plan
            </a>
          </div>

          <div className="mt-6 card">
            <h3 className="font-medium">Features</h3>
            <ul className="mt-3 space-y-2 muted">
              <li>CRUD todos with notes, due date, and reminders</li>
              <li>In-browser notifications; optional background FCM push</li>
              <li>Firestore sync — easy to add your Firebase project</li>
              <li>Accessible black & white design, mobile-first</li>
            </ul>
          </div>
        </section>

        <aside className="flex items-center justify-center">
          <div className="w-full max-w-lg card text-center">
            <Image src="/next.svg" alt="Logo" width={120} height={24} className="mx-auto dark:invert" />
            <p className="muted mt-4">Built with Next.js · Firestore-ready · Notifications</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
