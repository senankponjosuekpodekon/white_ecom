export default function Loading() {
  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--color-border)] rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow"
            >
              <div className="w-full h-56 bg-[var(--color-border)] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-3/4 bg-[var(--color-border)] rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-[var(--color-border)] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
