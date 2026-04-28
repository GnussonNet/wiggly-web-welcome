import { useEffect } from "react";
import Worm from "@/components/Worm";

const Index = () => {
  useEffect(() => {
    document.title = "Daggmask – Snart här";
    const meta = document.querySelector('meta[name="description"]') ?? (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute("content", "Daggmask – något nytt gror under ytan. En tillfällig landningssida medan vi gräver vidare.");
  }, []);

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "var(--gradient-soil)" }}
    >
      {/* Subtle soil texture via radial dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--soil-dark) / 0.18) 1px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />

      <Worm />

      <div className="relative z-20 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-8 py-6 md:px-16">
          <div className="font-display text-xl font-semibold tracking-tight text-foreground">
            daggmask<span className="text-accent">.</span>
          </div>
          <div className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Est. 2026
          </div>
        </header>

        <section className="flex flex-1 items-center px-8 md:px-16">
          <div className="max-w-3xl">
            <p className="font-body mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Något gror under ytan
            </p>
            <h1 className="font-display text-6xl font-light leading-[0.95] tracking-tight text-foreground md:text-8xl lg:text-9xl">
              Dagg<span className="italic text-accent">mask</span>.
            </h1>
            <p className="font-body mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Vi gräver oss fram, en centimeter i taken. En riktig sida kommer snart —
              under tiden får du sällskap av vår lilla vän som slingrar runt på skärmen.
            </p>
          </div>
        </section>

        <footer className="px-8 pb-8 md:px-16">
          <div className="flex items-end justify-between">
            <div className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tillfällig landningssida
            </div>
            <div className="font-display text-sm italic text-muted-foreground">
              Lumbricus terrestris
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Index;
