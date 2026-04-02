import { Network, FileCode2, Plug, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const accessPoints = [
  {
    icon: Network,
    title: "Accesso alla Rete",
    description:
      "Connetti le tue applicazioni direttamente alla mainnet Dyneros Chain o a un'istanza privata dedicata.",
    tag: "RPC / WebSocket",
  },
  {
    icon: FileCode2,
    title: "Deploy di Smart Contract",
    description:
      "Distribuisci e gestisci smart contract su Dyneros Chain usando gli strumenti di sviluppo che già conosci.",
    tag: "EVM Compatibile",
  },
  {
    icon: Plug,
    title: "Integrazione API",
    description:
      "API RESTful e GraphQL per leggere lo stato della chain, inviare transazioni e monitorare gli eventi.",
    tag: "REST / GraphQL",
  },
];

const codeSnippet = `// Connetti a Dyneros Chain
const provider = new DynerosProvider({
  network: "mainnet",
  endpoint: "https://mainnet.dyneros.com"
});

// Deploy di un contratto
const contract = await provider
  .deploy(abi, bytecode)
  .send({ from: account });

console.log("Deployato a:", contract.address);`;

export default function DevelopersSection() {
  return (
    <section id="developers" className="section-padding bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                Per i Costruttori
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Costruisci su Dyneros
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Accedi all'infrastruttura Dyneros Chain attraverso interfacce pulite e ben documentate.
              Nessuna complessità interna esposta — solo gli strumenti di cui hai bisogno per costruire.
            </p>

            <div className="space-y-4 mb-10">
              {accessPoints.map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] card-hover group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[oklch(68%_0.19_72/0.15)] transition-colors">
                    <point.icon className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {point.title}
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground bg-[oklch(18%_0.008_264)] px-2 py-0.5 rounded-full">
                        {point.tag}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold group"
              size="lg"
            >
              Inizia a Costruire
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right: code snippet */}
          <div>
            <div className="rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)] overflow-hidden shadow-2xl">
              {/* Terminal bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[oklch(55%_0.22_25/0.7)]" />
                  <div className="w-3 h-3 rounded-full bg-[oklch(65%_0.18_85/0.7)]" />
                  <div className="w-3 h-3 rounded-full bg-[oklch(60%_0.18_145/0.7)]" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">dyneros-sdk.js</span>
                </div>
              </div>
              {/* Code */}
              <div className="p-5 overflow-x-auto">
                <pre className="text-xs leading-relaxed font-mono">
                  {codeSnippet.split("\n").map((line, i) => {
                    const isComment = line.trim().startsWith("//");
                    return (
                      <div key={i} className="flex gap-4">
                        <span className="select-none text-[oklch(30%_0.010_264)] w-4 text-right flex-shrink-0">
                          {i + 1}
                        </span>
                        <span
                          className={
                            isComment
                              ? "text-[oklch(45%_0.010_264)]"
                              : "text-[oklch(80%_0.005_264)]"
                          }
                        >
                          {line}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["TypeScript SDK", "Python SDK", "REST API", "WebSocket", "GraphQL"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-muted-foreground bg-[oklch(14%_0.007_264)] border border-[oklch(22%_0.008_264)] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
