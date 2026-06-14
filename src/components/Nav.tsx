"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyChip, GitHubIcon } from "@/components/ui";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <a className="wordmark" href="#top">
          <span className="baton-glyph" />
          baton
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#opensource">Open Source</a>
          <Link href="/docs">Docs</Link>
        </nav>
        <div className="nav-right">
          <CopyChip text="npm i -g baton" />
          <a className="gh-star" href="#opensource">
            <GitHubIcon size={15} /> Star <span className="count">4.2k</span>
          </a>
        </div>
      </div>
    </header>
  );
}
