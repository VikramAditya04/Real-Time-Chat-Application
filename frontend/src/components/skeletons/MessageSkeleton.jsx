export default function MessageSkeleton() {
  return (
    <div className="space-y-5 p-5 sm:p-7">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`flex animate-pulse ${
            index % 2 ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`h-16 rounded-2xl bg-white/7 ${
              index % 3 ? "w-52" : "w-72"
            }`}
          />
        </div>
      ))}
    </div>
  );
}