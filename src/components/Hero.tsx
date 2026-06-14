"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Reveal, Eyebrow, GitHubIcon } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks";
import HeroPoster from "@/components/hero/HeroPoster";

// R3F scene: client-only, lazy, never blocks LCP. Poster shows while it loads.
const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => <HeroPoster />,
});

const HERO_SUBHEAD =
  "Baton coordinates multiple AI coding agents — Claude Code, Cursor, Codex, Gemini — on one repo. Isolated git worktrees, a live dashboard, shared memory, and one-file session handoff. No server lock-in. Open source.";

const TERM_CMD = "baton pass my-task --to cursor";

/** Character-by-character typing loop with blinking caret. Idle when reduced. */
function useTypeLoop(text: string, reduced: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      if (!alive) return;
      i++;
      setN(Math.min(i, text.length));
      if (i <= text.length) t = setTimeout(step, 42 + Math.random() * 55);
      else
        t = setTimeout(() => {
          i = 0;
          setN(0);
          t = setTimeout(step, 350);
        }, 3000);
    };
    t = setTimeout(step, 900);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [text, reduced]);
  return n;
}

function TermChip({ reduced }: { reduced: boolean }) {
  const n = useTypeLoop(TERM_CMD, reduced);
  const shown = reduced ? TERM_CMD : TERM_CMD.slice(0, n);
  return (
    <div className="term-chip" role="img" aria-label={`terminal: ${TERM_CMD}`}>
      <span className="prompt">$</span>
      <span>
        {shown}
        <span className="caret" />
      </span>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  // HeroScene is dynamically imported with ssr:false, so the server (and the
  // pre-hydration client) render its poster fallback — no mount-gate needed.
  return (
    <section className="hero" id="top">
      {reduced ? <HeroPoster /> : <HeroScene />}
      <div className="hero-fade" />
      <div className="wrap" style={{ width: "100%", position: "relative", zIndex: 2 }}>
        <div className="hero-content">
          <Reveal>
            <Eyebrow>Multi-agent coordination</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1>
              Plan on your expensive agent.
              <br />
              Pass the <span className="accent-word">baton</span> to your cheap one.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="subhead">{HERO_SUBHEAD}</p>
          </Reveal>
          <Reveal delay={280}>
            <div className="cta-row">
              <a className="btn btn-primary" href="#opensource">
                <GitHubIcon size={17} /> Star on GitHub
              </a>
              <a className="btn btn-ghost" href="#how">
                Read the docs
              </a>
            </div>
          </Reveal>
          <Reveal delay={380}>
            <TermChip reduced={reduced} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
