export default function NoChatSelected() {
  return (
    <section className="flex flex-1 items-center justify-center p-5 sm:p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-4xl shadow-[0_0_30px_rgba(56,189,248,0.12)]">
          💬
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          Choose a conversation
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Select a person from the sidebar to load your saved messages and start
          chatting in real time.
        </p>
      </div>
    </section>
  );
}
