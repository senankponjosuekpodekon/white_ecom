export function Features({
  title,
  features,
}: {
  title: string;
  features?: Array<{ title?: string; text?: string }>;
}) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-center mb-12 text-[var(--color-foreground)]">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features?.map((feature, i) => (
            <div
              key={i}
              className="card-design p-8 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                {feature.title?.charAt(0).toUpperCase() ?? "✓"}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-[var(--color-foreground)]">
                {feature.title ?? ""}
              </h3>
              <p className="text-[var(--color-muted)]">{feature.text ?? ""}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
