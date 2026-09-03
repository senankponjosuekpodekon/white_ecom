import { getTranslations } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ValueProposition } from "@/components/ValueProposition";
import { SocialProof } from "@/components/SocialProof";
import { CTA } from "@/components/CTA";

export default async function Home({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "home" });
  const config = await getStoreConfig();
  const design = config.design;

  const featureTranslations = {
    feature1Title: t("feature1Title"),
    feature1Text: t("feature1Text"),
    feature2Title: t("feature2Title"),
    feature2Text: t("feature2Text"),
    feature3Title: t("feature3Title"),
    feature3Text: t("feature3Text"),
  };

  return (
    <>
      {design.ux.heroEnabled !== false && (
        <Hero
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          cta={t("cta")}
          locale={locale}
          design={design}
        />
      )}
      {design.ux.featuresEnabled !== false && (
        <Features title={t("featuresTitle")} translations={featureTranslations} />
      )}
      {design.ux.valuePropositionEnabled !== false && (
        <ValueProposition title={t("valueTitle")} text={t("valueText")} />
      )}
      {design.ux.socialProofEnabled !== false && (
        <SocialProof title={t("proofTitle")} />
      )}
      {design.ux.ctaEnabled !== false && (
        <CTA
          title={t("ctaTitle")}
          subtitle={t("ctaSubtitle")}
          button={t("ctaButton")}
          locale={locale}
        />
      )}
    </>
  );
}
