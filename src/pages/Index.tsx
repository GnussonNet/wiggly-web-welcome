import { useEffect, useState } from "react";
import Worm from "@/components/Worm";

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

      <div className="relative z-20 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-6 md:px-10">
          <div className="font-mono text-sm tracking-tight text-foreground">
            daggmask.com
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            cybersecurity
          </div>
        </header>

        <section className="flex flex-1 items-center px-6 md:px-10">
          <div>
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
          </div>
        </section>

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
