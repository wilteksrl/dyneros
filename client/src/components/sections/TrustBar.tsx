export default function TrustBar() {
  const pillars = [
    {
      label: "Infrastruttura enterprise-ready",
      description: "Progettata per conformità, controllo e prevedibilità su larga scala.",
    },
    {
      label: "Rete di sviluppo globale",
      description: "15 ingegneri core e 100+ collaboratori in ogni fuso orario.",
    },
    {
      label: "Scalabile fin dal primo giorno",
      description: "Architettura che cresce con la tua azienda — senza re-platforming.",
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
