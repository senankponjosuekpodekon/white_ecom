import Link from "next/link";
import type { Locale } from "@/i18n";
import type { DesignFullConfig } from "@/lib/design";

export function Hero({
  title,
  subtitle,
  cta,
  locale,
  design,
}: {
  title: string;
  subtitle: string;
  cta: string;
  locale: Locale;
  design: DesignFullConfig;
}) {
  return (
    <section
      className={`relative py-24 px-4 sm:px-6 lg:px-8 ${
        design.effects.heroGradient ? "hero-gradient" : "section-gradient"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center animate-slide-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <Link href={`/${locale}/products`} className="btn-primary">
          {cta}
        </Link>
      </div>
    </section>
  );
}
