export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            {new Date().getFullYear()} {name}. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-[var(--color-muted)]">
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
