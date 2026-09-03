export function ValueProposition({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 section-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {title}
        </h2>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
