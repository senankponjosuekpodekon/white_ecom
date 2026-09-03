export function ValueProposition({
  content,
}: {
  content?: { title?: string; text?: string };
}) {
  if (!content?.title && !content?.text) return null;
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 section-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {content.title ?? ""}
        </h2>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed">{content.text ?? ""}</p>
      </div>
    </section>
  );
}
