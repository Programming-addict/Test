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
  const { signIn, signUp, signInWithGoogle } = useAuth();
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

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
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

      <button type="button" className="btn-google" onClick={handleGoogle} disabled={busy}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="auth-divider">or</div>

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
