import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import WormLogo from "./WormLogo";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => { setMenuOpen(false); }, [pathname, hash]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header page-width">
      <WormLogo />
      <nav className="desktop-navigation" aria-label="Main navigation">
        <Link to="/#tools">Tools</Link>
        <Link to="/blog" aria-current={pathname.startsWith("/blog") ? "page" : undefined}>Blog</Link>
      </nav>
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Trigger className="mobile-menu-trigger" aria-label="Open menu"><Menu size={22} aria-hidden="true" /></Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="mobile-menu-overlay" />
          <Dialog.Content className="mobile-menu-panel" aria-describedby={undefined}>
            <div className="mobile-menu-heading">
              <Dialog.Title>Menu</Dialog.Title>
              <Dialog.Close className="mobile-menu-close" aria-label="Close menu"><X size={22} aria-hidden="true" /></Dialog.Close>
            </div>
            <nav aria-label="Mobile navigation">
              <Dialog.Close asChild><Link to="/#tools">Tools<span>Explore Trace, Burrow, and Loam.</span></Link></Dialog.Close>
              <Dialog.Close asChild><Link to="/blog" aria-current={pathname.startsWith("/blog") ? "page" : undefined}>Blog<span>Read behind the tools.</span></Link></Dialog.Close>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer page-width">
    <span>© {new Date().getFullYear()} daggmask. All rights reserved.</span>
  </footer>;
}
