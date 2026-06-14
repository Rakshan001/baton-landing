"use client";

import { useEffect, useRef } from "react";
import { Reveal, Eyebrow } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks";

const FEED_ROWS = [
  { who: "claude", cls: "claude", action: "committed", file: "src/server/sse.ts", when: "12s" },
  { who: "cursor", cls: "cursor", action: "editing", file: "src/ui/StatusPanel.tsx", when: "now" },
  { who: "claude", cls: "claude", action: "pinned fact", file: "memory/auth-jwt", when: "1m" },
  { who: "codex", cls: "codex", action: "took handoff", file: "fix-flaky-tests", when: "3m" },
  { who: "cursor", cls: "cursor", action: "opened worktree", file: ".baton/wt/my-task", when: "4m" },
  { who: "claude", cls: "claude", action: "passed", file: "my-task → cursor", when: "5m" },
];

function DashboardMock() {
  return (
    <>
      <div className="browser-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="url-pill">localhost:7077</span>
        <span style={{ width: 33 }} />
      </div>
      <div className="dash-body">
        <nav className="dash-side" aria-label="Dashboard sections">
          {["Activity", "Conflicts", "Terminals", "Memory", "Graph"].map((s, i) => (
            <div key={s} className={"dash-side-item" + (i === 0 ? " on" : "")}>
              <span className="ico" />
              {s}
            </div>
          ))}
        </nav>
        <div className="dash-main">
          <div className="dash-h">Activity</div>
          {FEED_ROWS.map((r, i) => (
            <div key={i} className="feed-row">
              <span className={"who " + r.cls}>{r.who}</span>
              <span>{r.action}</span>
              <span className="file">{r.file}</span>
              <span className="when">{r.when}</span>
            </div>
          ))}
        </div>
        <div className="dash-right">
          <div className="conflict-panel">
            <div className="cp-title">Conflicts · 1</div>
            <div className="cp-file">src/shared/events.ts</div>
            <div className="cp-sub">claude + cursor editing — warned both</div>
          </div>
          <div className="term-pane">
            <div className="tp-title">tmux · claude</div>
            <div>
              <span className="g">✓</span> 4 tests passing
            </div>
            <div>watching src/server …</div>
          </div>
          <div className="term-pane">
            <div className="tp-title">tmux · cursor</div>
            <div>resuming from HANDOFF.md</div>
            <div>
              <span className="g">✓</span> worktree clean
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      const fr = frameRef.current;
      if (fr) {
        fr.style.transform = "none";
        fr.style.opacity = "1";
      }
      return;
    }
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current,
          fr = frameRef.current;
        if (!el || !fr) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, 1 - (r.top - window.innerHeight * 0.05) / (window.innerHeight * 0.75))
        );
        fr.style.transform = `rotateX(${(1 - p) * 17}deg)`;
        fr.style.opacity = String(0.4 + p * 0.6);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section className="dash-section">
      <div className="wrap">
        <Reveal>
          <div className="section-head" style={{ margin: "0 auto", textAlign: "center" }}>
            <Eyebrow>Dashboard</Eyebrow>
            <h2>Watch the relay live.</h2>
          </div>
        </Reveal>
        <div ref={sectionRef} className="dash-perspective">
          <div ref={frameRef} className="dash-frame" style={{ opacity: 0.4 }}>
            <DashboardMock />
            <div className="dash-glow" />
          </div>
        </div>
        <p className="dash-caption">
          A realtime dashboard on <code>localhost:7077</code>. Activity, conflicts, terminals,
          memory, the graph.
        </p>
      </div>
    </section>
  );
}
