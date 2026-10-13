import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Worm from "@/components/Worm";

const PROJECTS = [
  { name: "Burrow", href: "https://burrow.daggmask.com", domain: "burrow.daggmask.com" },
  { name: "Loam", href: "https://loam.daggmask.com", domain: "loam.daggmask.com" },
  { name: "Trace", href: "https://trace.daggmask.com", domain: "trace.daggmask.com" },
];

const FACTS = [
  "Did you know? Earthworms have five hearts. Redundancy is good security.",
  "Did you know? An earthworm can eat its own body weight in soil every day.",
  "Did you know? Cleopatra declared earthworms sacred and forbade their export.",
  "Did you know? Earthworms breathe through their skin — no firewall required.",
  "Did you know? Charles Darwin spent 39 years studying earthworms.",
  "Did you know? If cut in half, only the head end may regenerate. Don't try it.",
  "Did you know? Earthworms have no eyes, but sense light through their skin.",
  "Did you know? There are over 7,000 species of earthworms worldwide.",
  "Did you know? Earthworm castings are one of nature's best fertilizers.",
  "Did you know? The Australian Giant Gippsland earthworm can grow up to 3 meters.",
  "Did you know? Earthworms tunnel silently — much like a good pentester.",
  "Did you know? Earthworms are hermaphrodites — every worm has both roles.",
];

const Index = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.title = "daggmask.com — cybersecurity";
    const meta = document.querySelector('meta[name="description"]') ?? (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute("content", "daggmask.com — cybersecurity. Quietly digging through the layers.");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % FACTS.length);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <Worm />

      <div className="pointer-events-none relative z-20 flex min-h-screen flex-col">
        <header className="flex items-center px-6 py-6 md:px-10">
          <div className="font-mono text-sm tracking-tight text-foreground">
            daggmask.com
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-14 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <section aria-label="About daggmask">
            <h1 className="text-5xl font-medium tracking-tight text-foreground md:text-7xl">
              daggmask<span className="text-muted-foreground">.com</span>
            </h1>
            <p
              className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0 }}
              aria-live="polite"
            >
              {FACTS[factIndex]}
            </p>
          </section>

          <section aria-labelledby="projects-heading" className="w-full max-w-sm lg:w-80 lg:shrink-0">
            <h2 id="projects-heading" className="mb-4 text-sm font-medium text-muted-foreground">
              Projects
            </h2>
            <ul className="overflow-hidden rounded-xl border border-border bg-background/95">
              {PROJECTS.map((project) => (
                <li key={project.href}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto group flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground motion-reduce:transition-none"
                  >
                    <span className="min-w-0">
                      <span className="block text-lg font-medium tracking-tight">{project.name}</span>
                      <span className="mt-1 block break-all font-mono text-xs text-muted-foreground">{project.domain}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground" />
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3 border-t border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full border border-current" />
                More projects coming
              </li>
            </ul>
          </section>
        </div>

        <footer className="px-6 pb-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} daggmask
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Index;
