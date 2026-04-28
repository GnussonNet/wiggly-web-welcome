import { useEffect } from "react";
import Worm from "@/components/Worm";

const Index = () => {
  useEffect(() => {
    document.title = "daggmask.com — cybersecurity";
    const meta = document.querySelector('meta[name="description"]') ?? (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute("content", "daggmask.com — cybersecurity. Coming soon.");
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
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Coming soon.
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
