const items = [
  { key: "feature1" },
  { key: "feature2" },
  { key: "feature3" },
] as const;

export function Features({
  title,
  translations,
}: {
  title: string;
  translations: Record<string, string>;
}) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-center mb-12 text-[var(--color-foreground)]">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {items.map(({ key }) => (
            <div
              key={key}
              className="card-design p-8 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                {translations[`${key}Title`].charAt(0)}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-[var(--color-foreground)]">
                {translations[`${key}Title`]}
              </h3>
              <p className="text-[var(--color-muted)]">
                {translations[`${key}Text`]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
