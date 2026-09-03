import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n";
import type { DesignFullConfig } from "@/lib/design";
import type { LocalizedContent } from "@/lib/content";

export function Hero({
  locale,
  design,
  content,
}: {
  locale: Locale;
  design: DesignFullConfig;
  content: LocalizedContent["hero"];
}) {
  return (
    <section
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${
        design.effects.heroGradient ? "hero-gradient" : "section-gradient"
      }`}
    >
      {content?.image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={content.image}
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-transparent to-[var(--color-background)]" />
        </div>
      )}
      <div className="max-w-4xl mx-auto text-center animate-slide-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {content?.title ?? "Bienvenue"}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
          {content?.subtitle ?? ""}
        </p>
        <Link href={`/${locale}/products`} className="btn-primary">
          {content?.cta ?? "Explorer"}
        </Link>
      </div>
    </section>
  );
}
