export function SocialProof({
  content,
}: {
  content?: { title?: string; stats?: Array<{ label: string; value: string }> };
}) {
  const stats = content?.stats ?? [];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-center mb-12 text-[var(--color-foreground)]">
          {content?.title ?? ""}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="card-design p-8">
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                {stat.value}
              </p>
              <p className="text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
