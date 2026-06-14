"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Eyebrow, CheckIcon } from "@/components/ui";

const HIW_STEPS = [
  {
    n: "01",
    title: "Plan",
    cmd: "baton start my-task --agent claude",
    body: "Claude Code plans in its own worktree at .baton/wt/my-task. Every session event streams into a JSONL buffer.",
  },
  {
    n: "02",
    title: "Pass",
    cmd: "baton pass my-task --to cursor",
    body: "The whole session condenses into one HANDOFF.md — objective, plan, remaining tasks, estimated cost. Plain markdown.",
  },
  {
    n: "03",
    title: "Take",
    cmd: "baton take my-task",
    body: "Cursor picks up the handoff and resumes exactly where Claude left off — in its own isolated worktree.",
  },
  {
    n: "04",
    title: "Coordinate",
    cmd: "baton status --live",
    body: "SSE-streamed edit signals. Conflicts before they happen, not after.",
  },
  {
    n: "05",
    title: "Done & merge",
    cmd: "baton done my-task",
    body: "A completion report is filed to .baton/reports/ and the branch merges to main.",
  },
];

function AgentNode({
  name,
  tag,
  active,
  status,
  style,
}: {
  name: string;
  tag: string;
  active: boolean;
  status: string;
  style: CSSProperties;
}) {
  return (
    <div className={"hiw-node" + (active ? " active" : "")} style={style}>
      <div className="agent-row">
        <div className="agent-avatar">{tag}</div>
        <div>
          <div className="agent-name">{name}</div>
          <div className="agent-status">{status}</div>
        </div>
      </div>
    </div>
  );
}

function HiwStage({ step }: { step: number }) {
  const aStatus = ["planning", "passing…", "idle", "editing", "merged"][step];
  const bStatus = ["idle", "idle", "resuming", "editing", "done"][step];
  const aActive = step === 0 || step === 1 || step === 3;
  const bActive = step === 2 || step === 3;
  const tEase = "cubic-bezier(.5,.05,.3,1)";

  let cardStyle: CSSProperties = {
    left: "29%",
    top: "40%",
    opacity: 0,
    transform: "scale(.85)",
    transition: `opacity .5s, transform .7s ${tEase}`,
  };
  if (step === 1) cardStyle = { ...cardStyle, opacity: 1, transform: "scale(1)" };
  if (step === 2)
    cardStyle = {
      ...cardStyle,
      opacity: 0,
      transform: "translate(150px,-160px) scale(.45)",
      transition: `transform .9s ${tEase}, opacity .55s .5s`,
    };

  return (
    <div className="hiw-stage" aria-hidden="true">
      <svg className="hiw-svg">
        <path
          d="M 110 110 C 230 240, 390 240, 510 110"
          className="hiw-dash"
          style={{ opacity: step === 2 ? 1 : 0, transition: "opacity .5s" }}
        />
      </svg>

      <AgentNode name="Claude Code" tag="CC" active={aActive} status={aStatus} style={{ left: "2%", top: "7%" }} />
      <AgentNode name="Cursor" tag="CU" active={bActive} status={bStatus} style={{ right: "2%", top: "7%" }} />
      <span className="wt-chip" style={{ left: "2%", top: "calc(7% + 84px)", color: aActive ? "var(--dim)" : undefined }}>
        .baton/wt/my-task
      </span>
      <span
        className="wt-chip"
        style={{ right: "2%", top: "calc(7% + 84px)", opacity: step >= 2 ? 1 : 0.35, color: bActive ? "var(--dim)" : undefined }}
      >
        .baton/wt/my-task
      </span>

      {/* step 0: JSONL buffer */}
      <div
        className={"jsonl-box" + (step === 0 ? " streaming" : "")}
        style={{
          left: "6%",
          top: "46%",
          opacity: step === 0 ? 1 : 0,
          transform: step === 0 ? "none" : "translate(60px,-20px) scale(.7)",
        }}
      >
        <div className="jsonl-head">session.jsonl — streaming</div>
        <div className="jsonl-lines">
          <div className="jsonl-line" style={{ width: "82%" }} />
          <div className="jsonl-line c" style={{ width: "64%" }} />
          <div className="jsonl-line" style={{ width: "91%" }} />
          <div className="jsonl-line c" style={{ width: "45%" }} />
          <div className="jsonl-line" style={{ width: "73%" }} />
        </div>
      </div>

      {/* steps 1-2: HANDOFF.md card */}
      <div className="handoff-card" style={cardStyle}>
        <div className="handoff-head">
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true">
            <path d="M1 1h7l4 4v9H1V1z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          HANDOFF.md
        </div>
        <div className="handoff-body">
          <div>
            <span className="k">objective:</span> <span className="v">SSE reconnect backoff</span>
          </div>
          <div>
            <span className="k">plan:</span> <span className="v">4 steps · 1 done</span>
          </div>
          <div>
            <span className="k">remaining:</span> <span className="v">3 tasks</span>
          </div>
          <div>
            <span className="k">est_cost_usd:</span> <span className="cost">0.05</span>
          </div>
        </div>
      </div>

      {/* step 3: live edit signals */}
      <div
        className="file-rows"
        style={{
          left: "50%",
          top: "46%",
          opacity: step === 3 ? 1 : 0,
          transform: step === 3 ? "translateX(-50%)" : "translateX(-50%) translateY(18px)",
          pointerEvents: "none",
        }}
      >
        <div className="file-row">
          <span className="sig a" />
          src/server/sse.ts
        </div>
        <div className="file-row">
          <span className="sig b" />
          src/ui/StatusPanel.tsx
        </div>
        <div className="file-row warn">
          <span className="sig a" />
          <span className="sig b" style={{ marginLeft: -4 }} />
          src/shared/events.ts
          <span className="warn-tag">overlap</span>
        </div>
      </div>

      {/* step 4: done & merge */}
      <div
        className="done-block"
        style={{
          left: "50%",
          top: "40%",
          opacity: step === 4 ? 1 : 0,
          transform: step === 4 ? "translateX(-50%)" : "translateX(-50%) scale(.9)",
          pointerEvents: "none",
        }}
      >
        <div className="done-circle">
          <CheckIcon size={38} color="var(--accent)" />
        </div>
        <div className="done-chips">
          <span className="done-chip">
            <span className="ok">✓</span> report filed → .baton/reports/my-task.md
          </span>
          <span className="done-chip">
            <span className="ok">✓</span> wt/my-task merged → main
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const trackRef = useRef<HTMLElement>(null);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setProg(Math.min(1, Math.max(0, -r.top / total)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const step = Math.min(4, Math.floor(prog * 5));
  return (
    <section ref={trackRef} className="hiw-track" id="how" style={{ height: "520vh" }}>
      <div className="hiw-sticky">
        <div className="wrap" style={{ width: "100%" }}>
          <Eyebrow>Session handoff</Eyebrow>
          <div className="hiw-grid">
            <div className="hiw-steps">
              <div className="hiw-progress">
                <div className="hiw-progress-fill" style={{ height: `${prog * 100}%` }} />
              </div>
              {HIW_STEPS.map((s, i) => (
                <div key={s.n} className={"hiw-step" + (i === step ? " active" : "")}>
                  <div className="step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <div
                    style={{
                      maxHeight: i === step ? 170 : 0,
                      overflow: "hidden",
                      transition: "max-height .55s cubic-bezier(.2,.7,.2,1)",
                    }}
                  >
                    <p>{s.body}</p>
                    <span className="cmd">$ {s.cmd}</span>
                  </div>
                </div>
              ))}
            </div>
            <HiwStage step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
