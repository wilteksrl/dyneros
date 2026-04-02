export default function TrustBar() {
  const pillars = [
    {
      label: "Enterprise-ready infrastructure",
      description: "Built for compliance, control, and predictability at scale.",
    },
    {
      label: "Global development network",
      description: "15 core engineers and 100+ contributors across every timezone.",
    },
    {
      label: "Built for scale from day one",
      description: "Architecture that grows with your business — no re-platforming.",
    },
  ];

  return (
    <section className="border-y border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[oklch(22%_0.008_264)]">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="px-8 py-8 md:py-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1 h-4 rounded-full bg-[oklch(68%_0.19_72)] flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {pillar.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
