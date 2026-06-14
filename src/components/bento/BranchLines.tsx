"use client";

import { useInView } from "@/lib/hooks";

/** Worktree branch lines that draw in on view. Ported from baton-bento.jsx. */
export default function BranchLines() {
  const [ref, vis] = useInView<HTMLDivElement>({ threshold: 0.4 });
  return (
    <div ref={ref} className={vis ? "in-view" : ""}>
      <svg className="branch-svg" viewBox="0 0 300 96" aria-hidden="true">
        <path className="branch-path" d="M 10 48 H 290" stroke="rgba(255,255,255,0.25)" />
        <path
          className="branch-path b2"
          d="M 60 48 C 90 48, 90 20, 120 20 H 200 C 230 20, 230 48, 260 48"
          stroke="var(--accent)"
          opacity="0.8"
        />
        <path
          className="branch-path b3"
          d="M 60 48 C 90 48, 90 76, 120 76 H 180 C 210 76, 210 48, 240 48"
          stroke="var(--cyan)"
          opacity="0.7"
        />
        <circle cx="60" cy="48" r="3" fill="rgba(255,255,255,0.6)" />
        <circle cx="160" cy="20" r="3" fill="var(--accent)" />
        <circle cx="150" cy="76" r="3" fill="var(--cyan)" />
        <circle cx="260" cy="48" r="3" fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}
