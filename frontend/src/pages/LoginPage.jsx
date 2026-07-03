const fieldBase =
  "glass-input w-full rounded-2xl px-4 py-3.5 text-sm placeholder:text-slate-500 focus:outline-none";

function AuthShell({ title, subtitle, children, onSwitchAuth, switchText, onGoHome }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="hidden flex-1 flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,rgba(10,16,30,0.95),rgba(6,10,20,0.86))] p-8 lg:flex">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-sky-300/80">Secure gateway</p>
            <h1 className="mt-4 max-w-md text-5xl font-black uppercase tracking-tight text-white">
              Open <span className="title-gradient">Chatzy</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Chats, photos, and reactions stay in sync-sign in on the right to continue.
            </p>
          </div>

          <div className="grid place-items-center rounded-[28px] border border-sky-400/15 bg-[radial-gradient(circle_at_center,rgba(21,112,239,0.24),transparent_55%)] px-6 py-10">
            <div className="relative h-64 w-64">
              <div className="absolute inset-0 rounded-full border border-sky-400/20 bg-sky-500/10 blur-2xl" />
              <div className="absolute inset-x-10 top-8 h-40 rounded-[999px] bg-gradient-to-b from-sky-300 via-blue-500 to-sky-700 shadow-[0_0_60px_rgba(59,130,246,0.4)]" />
              <div className="absolute inset-x-16 top-14 h-24 rounded-[999px] border border-white/35 bg-white/12 backdrop-blur-sm" />
              <div className="absolute left-1/2 top-[34%] h-20 w-20 -translate-x-1/2 rounded-full border border-white/30 bg-white/10 shadow-[inset_0_0_24px_rgba(255,255,255,0.2)]" />
              <div className="absolute inset-x-24 top-44 h-28 rounded-b-[120px] bg-gradient-to-b from-sky-400 to-blue-900 blur-[1px]" />
              <div className="absolute left-16 top-48 h-24 w-16 rounded-b-[60px] rounded-t-[80px] bg-gradient-to-b from-sky-400 to-blue-800 rotate-[-14deg]" />
              <div className="absolute right-16 top-48 h-24 w-16 rounded-b-[60px] rounded-t-[80px] bg-gradient-to-b from-sky-400 to-blue-800 rotate-[14deg]" />
            </div>
          </div>

          <div className="text-xs uppercase tracking-[0.35em] text-slate-400">End-to-end session · Encrypted in transit</div>
        </div>

        <div className="flex flex-1 items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <button type="button" onClick={onGoHome} className="text-sm font-medium text-slate-300 transition hover:text-white">
                ChatSphere
              </button>
            </div>

            <div className="glass-panel rounded-[32px] p-5 sm:p-7">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,38,0.98),rgba(9,13,25,0.88))] p-6 sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-[0_0_30px_rgba(56,189,248,0.14)]">
                  💬
                </div>

                <p className="mt-5 text-center text-[11px] uppercase tracking-[0.35em] text-sky-300/70">Secure entry</p>
                <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white">{title}</h2>
                <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-slate-300">{subtitle}</p>

                <div className="mt-8 space-y-4">{children}</div>

                <div className="mt-8 text-center text-sm text-slate-300">
                  New here?{" "}
                  <button type="button" onClick={onSwitchAuth} className="font-semibold text-sky-300 transition hover:text-sky-200">
                    {switchText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage({ onSwitchAuth, onGoHome, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await login(form);
    if (result.ok) onLoginSuccess();
    else setError(result.error);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to your account and continue the chat."
      onSwitchAuth={onSwitchAuth}
      switchText="Sign up"
      onGoHome={onGoHome}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-xs uppercase tracking-[0.3em] text-slate-400">Email address</label>
          <input id="login-email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldBase} type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <label htmlFor="login-password" className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
          <input id="login-password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={fieldBase} type="password" placeholder="Enter your password" />
        </div>
        {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
        <button disabled={isLoggingIn} type="submit" className="btn-primary w-full rounded-2xl px-6 py-4 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {isLoggingIn ? "Logging in…" : "Login →"}
        </button>
      </form>
    </AuthShell>
  );
}
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
