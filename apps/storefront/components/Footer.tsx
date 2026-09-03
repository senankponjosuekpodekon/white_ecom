import { LocalizedContent } from "@/lib/content";

export function Footer({
  name,
  content,
}: {
  name: string;
  content?: LocalizedContent["footer"];
}) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            {new Date().getFullYear()} {name}. {content?.text ?? "Tous droits réservés."}
          </p>
          {content?.links && content.links.length > 0 && (
            <div className="flex gap-6 text-sm text-[var(--color-muted)]">
              {content.links.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
