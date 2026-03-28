import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthPanel() {
  const { user, profile, signIn, signUp, signInWithGoogle, signOut, authError, authLoading } = useAuth();
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    try {
      if (mode === "signin") {
        await signIn({ email: formData.email, password: formData.password });
      } else {
        await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName
        });
      }
      setStatus({ type: "success", message: mode === "signin" ? "Signed in." : "Account created." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to authenticate." });
    }
  };

  const handleGoogleLogin = async () => {
    setStatus({ type: "loading", message: "Redirecting to Google..." });
    try {
      await signInWithGoogle();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to start Google login." });
    }
  };

  if (!hasSupabaseConfig) {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-700 shadow-glow">
        Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable sign-in.
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur">
        <p className="text-sm text-slate-600">Checking sign-in status...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed In</p>
        <p className="mt-2 text-lg font-semibold text-midnight">{profile?.name || user.email}</p>
        <p className="text-sm text-slate-600">{user.email}</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-5 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Account</p>
          <h3 className="mt-2 text-lg font-semibold text-midnight">Sign in to continue</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1 text-xs font-semibold uppercase tracking-[0.2em]">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "signin" ? "bg-midnight text-white" : "text-slate-500"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "signup" ? "bg-midnight text-white" : "text-slate-500"
            }`}
          >
            Sign up
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        Continue with Google
      </button>

      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        {mode === "signup" ? (
          <label className="text-sm font-medium text-slate-700">
            Full name
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
            />
          </label>
        ) : null}

        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Password
          <input
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/40"
          />
        </label>

        {(status.message || authError) && (
          <p
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              status.type === "success" ? "bg-mint/20 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.message || authError}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-midnight px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slateink"
        >
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
