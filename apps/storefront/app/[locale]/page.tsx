import { getTranslations } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ValueProposition } from "@/components/ValueProposition";
import { SocialProof } from "@/components/SocialProof";
import { CTA } from "@/components/CTA";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "home" });
  const config = await getStoreConfig();
  const design = config.design;
  const content = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );

  return (
    <>
      {design.ux.heroEnabled !== false && (
        <Hero locale={locale} design={design} content={content.hero} />
      )}
      {design.ux.featuresEnabled !== false && (
        <Features
          title={t("featuresTitle")}
          features={content.features}
        />
      )}
      {design.ux.valuePropositionEnabled !== false && (
        <ValueProposition content={content.valueProposition} />
      )}
      {design.ux.socialProofEnabled !== false && (
        <SocialProof content={content.socialProof} />
      )}
      {design.ux.ctaEnabled !== false && (
        <CTA locale={locale} content={content.cta} />
      )}
    </>
  );
}
