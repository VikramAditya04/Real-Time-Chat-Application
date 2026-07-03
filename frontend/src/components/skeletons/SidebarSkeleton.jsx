export default function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-3 py-3"
        >
          <div className="h-11 w-11 rounded-2xl bg-white/10" />

          <div className="flex-1">
            <div className="h-3 w-2/3 rounded bg-white/10" />
            <div className="mt-2 h-2.5 w-5/6 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}