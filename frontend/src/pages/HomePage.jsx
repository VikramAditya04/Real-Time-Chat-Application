const previewMessages = [
  { side: "left", name: "Ava", text: "The new release is live. Sync looks clean.", time: "09:12" },
  { side: "right", name: "You", text: "Perfect. I’m checking the latest chat room now.", time: "09:13" },
  { side: "left", name: "Ava", text: "Messages are flowing in real time without refresh.", time: "09:14" },
];

function TopActionButton({ label, onClick, variant = "secondary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition duration-200 ${
        variant === "primary" ? "btn-primary text-white" : "btn-secondary text-slate-100 hover:border-slate-400/30"
      }`}
    >
      {label}
    </button>
  );
}

export default function HomePage({ onGoLogin, onGoSignUp }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-sky-300/70">Private session</p>
            <h1 className="mt-1 text-lg font-semibold tracking-wide text-white">Open Chatzy</h1>
          </div>

          <div className="flex items-center gap-3">
            <TopActionButton label="Login" onClick={onGoLogin} />
            <TopActionButton label="Sign up" onClick={onGoSignUp} variant="primary" />
          </div>
        </header>

        <section className="grid flex-1 gap-8 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
          <div className="noise-mask relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,rgba(10,16,30,0.9),rgba(6,10,20,0.78))] p-6 sm:p-8">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.45em] text-sky-300/80">Secure gateway</p>
              <h2 className="mt-4 max-w-lg text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
                OPEN <span className="title-gradient">CHATZY</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Chats, photos, and reactions stay in sync-sign in on the right to continue.
              </p>
            </div>

            <div className="mt-8 grid place-items-center rounded-[28px] border border-sky-400/15 bg-[radial-gradient(circle_at_center,rgba(21,112,239,0.24),transparent_55%)] px-6 py-10">
              <div className="relative h-64 w-64 sm:h-80 sm:w-80">
                <div className="absolute inset-0 rounded-full border border-sky-400/20 bg-sky-500/10 blur-2xl" />
                <div className="absolute inset-x-10 top-8 h-40 rounded-full bg-linear-to-b from-sky-300 via-blue-500 to-sky-700 shadow-[0_0_60px_rgba(59,130,246,0.4)]" />
                <div className="absolute inset-x-16 top-14 h-24 rounded-full border border-white/35 bg-white/12 backdrop-blur-sm" />
                <div className="absolute left-1/2 top-[34%] h-20 w-20 -translate-x-1/2 rounded-full border border-white/30 bg-white/10 shadow-[inset_0_0_24px_rgba(255,255,255,0.2)]" />
                <div className="absolute inset-x-24 top-44 h-28 rounded-b-[120px] bg-linear-to-b from-sky-400 to-blue-900 blur-[1px]" />
                <div className="absolute left-16 top-48 h-24 w-16 rounded-b-[60px] rounded-t-[80px] bg-linear-to-b from-sky-400 to-blue-800 -rotate-14" />
                <div className="absolute right-16 top-48 h-24 w-16 rounded-b-[60px] rounded-t-[80px] bg-linear-to-b from-sky-400 to-blue-800 rotate-14" />
                <div className="absolute bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-[999px] bg-sky-500/30 blur-2xl" />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
              <span>End-to-end session</span>
              <span>Encrypted in transit</span>
              <span>Saved chat history</span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="glass-panel w-full max-w-lg rounded-4xl p-5 sm:p-7">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,38,0.98),rgba(9,13,25,0.88))] p-6 sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-[0_0_30px_rgba(56,189,248,0.14)]">
                  💬
                </div>

                <p className="mt-5 text-center text-[11px] uppercase tracking-[0.35em] text-sky-300/70">Secure entry</p>
                <h3 className="mt-3 text-center text-3xl font-bold tracking-tight text-white">Welcome to Chatzy</h3>
                <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-slate-300">
                  A clean glass interface for fast, private conversations and live delivery.
                </p>

                <div className="mt-8 grid gap-3">
                  <button
                    type="button"
                    onClick={onGoLogin}
                    className="btn-primary rounded-2xl px-6 py-4 text-base font-semibold text-white transition hover:brightness-110"
                  >
                    Continue to login
                  </button>
                  <button
                    type="button"
                    onClick={onGoSignUp}
                    className="btn-secondary rounded-2xl px-6 py-4 text-base font-semibold text-slate-100 transition hover:border-sky-400/30"
                  >
                    Create new account
                  </button>
                </div>

                <div className="mt-8 space-y-3">
                  {previewMessages.map((message) => (
                    <div
                      key={`${message.name}-${message.time}`}
                      className={`flex ${message.side === "right" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[80%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur-md">
                        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                          <span>{message.name}</span>
                          <span>{message.time}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-100">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
