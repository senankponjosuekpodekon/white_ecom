import { getTranslations } from "next-intl/server";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "contact" });
  const config = await getStoreConfig();
  const content = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const contact = content.contact;

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
          {contact?.title ?? t("title")}
        </h1>
        <p className="text-lg text-[var(--color-muted)] mb-8">
          {contact?.intro ?? t("intro")}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {contact?.email && (
            <div className="card-design p-5">
              <p className="text-sm text-[var(--color-muted)] mb-1">{t("emailLabel")}</p>
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {contact.email}
              </a>
            </div>
          )}
          {contact?.phone && (
            <div className="card-design p-5">
              <p className="text-sm text-[var(--color-muted)] mb-1">{t("phoneLabel")}</p>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          )}
          {contact?.address && (
            <div className="card-design p-5">
              <p className="text-sm text-[var(--color-muted)] mb-1">{t("addressLabel")}</p>
              <p className="font-medium text-[var(--color-foreground)] whitespace-pre-line">
                {contact.address}
              </p>
            </div>
          )}
          {contact?.hours && (
            <div className="card-design p-5">
              <p className="text-sm text-[var(--color-muted)] mb-1">{t("hoursLabel")}</p>
              <p className="font-medium text-[var(--color-foreground)]">{contact.hours}</p>
            </div>
          )}
        </div>

        {contact?.social && contact.social.length > 0 && (
          <div className="card-design p-5">
            <p className="text-sm text-[var(--color-muted)] mb-3">{t("socialLabel")}</p>
            <ul className="flex flex-wrap gap-4">
              {contact.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
