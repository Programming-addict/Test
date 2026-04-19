"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account with that email",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "An account with that email already exists",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/invalid-email": "Invalid email address",
  "auth/invalid-credential": "Incorrect email or password",
};

export default function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      const code: string = err?.code ?? "";
      setError(ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: "signin" | "signup") {
    setMode(next);
    setError("");
  }

  return (
    <div className="auth-form-card">
      <div className="auth-form-title">
        {mode === "signin" ? "Sign in" : "Create account"}
      </div>
      <div className="auth-form-subtitle">
        {mode === "signin" ? "to access your todos" : "to get started"}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="auth-input"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="auth-input"
            required
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="btn-primary auth-submit" disabled={busy}>
          {busy
            ? mode === "signin" ? "Signing in…" : "Creating account…"
            : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="auth-toggle">
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button onClick={() => switchMode("signup")} className="auth-toggle-btn">
              Create one
            </button>
          </>
        ) : (
          <>
            Already have one?{" "}
            <button onClick={() => switchMode("signin")} className="auth-toggle-btn">
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
