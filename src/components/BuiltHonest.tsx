"use client";

import { Reveal } from "@/components/ui";

const HONEST_FACTS = [
  "Zero-dependency daemon — raw node:http",
  "SSE, not socket.io",
  "Plain-markdown handoffs",
  "tmux-backed agent terminals",
  "Git-native: no external database",
  "MCP tools for every agent",
];

export default function BuiltHonest() {
  return (
    <section className="honest">
      <div className="wrap">
        <Reveal>
          <div className="honest-label">Built honest</div>
        </Reveal>
        <div className="honest-row">
          {HONEST_FACTS.map((f, i) => (
            <Reveal key={f} delay={i * 80} y={10}>
              <span className="honest-fact">{f}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
