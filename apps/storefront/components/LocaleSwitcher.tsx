"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LocaleSwitcher({
  locale,
  locales,
}: {
  locale: string;
  locales: string[];
}) {
  const pathname = usePathname();

  if (locales.length < 2) return null;

  const switchPath = (target: string) =>
    pathname.replace(/^\/[a-z]{2}(-[a-zA-Z]+)?(?=\/|$)/, `/${target}`) ||
    `/${target}`;

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={switchPath(l)}
          className={
            l === locale
              ? "px-1.5 py-0.5 rounded font-semibold text-[var(--color-primary)]"
              : "px-1.5 py-0.5 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          }
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
