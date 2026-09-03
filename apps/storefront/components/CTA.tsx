import Link from "next/link";
import type { Locale } from "@/i18n";

export function CTA({
  locale,
  content,
}: {
  locale: Locale;
  content?: { title?: string; subtitle?: string; button?: string };
}) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 hero-gradient">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
          {content?.title ?? ""}
        </h2>
        <p className="text-lg text-[var(--color-muted)] mb-8">{content?.subtitle ?? ""}</p>
        <Link href={`/${locale}/products`} className="btn-primary">
          {content?.button ?? "Voir les produits"}
        </Link>
      </div>
    </section>
  );
}
