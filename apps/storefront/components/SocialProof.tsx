const stats = [
  { label: "Produits", value: "50+" },
  { label: "Clients satisfaits", value: "1 000+" },
  { label: "Livraison", value: "48h" },
];

export function SocialProof({ title }: { title: string }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-center mb-12 text-[var(--color-foreground)]">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="card-design p-8">
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                {stat.value}
              </p>
              <p className="text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
