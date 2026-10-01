"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GoogleTag } from "./GoogleTag";
import type { Locale } from "@/i18n";

const CONSENT_KEY = "cookie-consent";

export function ConsentGate({
  gtagId,
  locale,
}: {
  gtagId?: string;
  locale: Locale;
}) {
  const t = useTranslations("consent");
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
    setMounted(true);
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && gtagId && <GoogleTag gtagId={gtagId} />}
      {mounted && consent === null && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="text-sm text-[var(--color-foreground)] flex-1">
              {t("text")}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="underline text-[var(--color-primary)]"
              >
                {t("learnMore")}
              </Link>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => decide("rejected")}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)]"
              >
                {t("reject")}
              </button>
              <button
                onClick={() => decide("accepted")}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
