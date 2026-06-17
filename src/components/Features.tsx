"use client";

import { Reveal, Eyebrow } from "@/components/ui";
import { ACCENT } from "@/lib/util";
import ForceGraph from "@/components/bento/ForceGraph";
import CostCounter from "@/components/bento/CostCounter";
import BranchLines from "@/components/bento/BranchLines";

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <Eyebrow>Features</Eyebrow>
            <h2>Everything between your agents, handled.</h2>
          </div>
        </Reveal>
        <div className="bento">
          <Reveal className="bento-card span3">
            <h3>Knowledge graph</h3>
            <p>Your repo, indexed into a queryable graph. Agents navigate instead of grepping.</p>
            <ForceGraph accent={ACCENT} />
          </Reveal>

          <Reveal className="bento-card span3" delay={90}>
            <h3>Session handoff</h3>
            <p>One markdown file carries the whole session: objective, plan, checklist, cost estimate.</p>
            <div className="handoff-mini">
              <div>
                <span className="k">---</span>
              </div>
              <div>
                <span className="k">objective:</span> <span className="v">SSE reconnect backoff</span>
              </div>
              <div>
                <span className="k">remaining_tasks:</span> <span className="v">3</span>
              </div>
              <div>
                <span className="k">est_cost_usd:</span> <span className="cost">0.05</span>
              </div>
              <div>
                <span className="k">---</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="bento-card span2" delay={0}>
            <h3>Worktree isolation</h3>
            <p>Every agent gets its own git worktree. No clobbered branches, ever.</p>
            <BranchLines />
          </Reveal>

          <Reveal className="bento-card span2" delay={90}>
            <h3>Live edit signals</h3>
            <p>See who&apos;s editing what, in real time. Overlaps warn before they conflict.</p>
            <div className="signal-rows">
              <div className="signal-row">
                <span className="sig a" />
                src/server/sse.ts
              </div>
              <div className="signal-row">
                <span className="sig b" />
                src/ui/StatusPanel.tsx
              </div>
              <div className="signal-row">
                <span className="sig a" />
                <span className="sig b" style={{ marginLeft: -5 }} />
                src/shared/events.ts
              </div>
            </div>
          </Reveal>

          <Reveal className="bento-card span2" delay={180}>
            <h3>Evidence-anchored memory</h3>
            <p>
              Shared facts pinned to commits and content hashes. Stale facts get withheld — agents
              can&apos;t hallucinate from them.
            </p>
            <div className="mem-rows">
              <div className="mem-row">
                <span className="fact">auth uses JWT, not sessions</span>
                <span className="anchor">⚓ 4f2c91a</span>
              </div>
              <div className="mem-row stale">
                <span className="fact">db client is knex</span>
                <span className="withheld">withheld</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="bento-card span3" delay={150}>
            <h3>Installable skills</h3>
            <p>
              A searchable catalog of agent playbooks, installed into each agent&apos;s own config — a
              bug-fix that maps the repo, confirms the root cause to 95%, then fixes one bug at a time.
            </p>
            <div className="cost-chips" style={{ marginTop: "auto" }}>
              <div className="cost-chip">.claude/skills</div>
              <div className="cost-chip">.cursor/rules</div>
              <div className="cost-chip hot">bug-fix</div>
            </div>
          </Reveal>

          <Reveal className="bento-card span3" delay={210}>
            <h3>Model routing</h3>
            <p>
              Route each task to the right agent by severity. Plan on your expensive model; pass the
              baton to a cheaper one.
            </p>
            <div className="cost-chips" style={{ marginTop: "auto" }}>
              <div className="cost-chip">heavy · opus</div>
              <div className="cost-chip">standard · cursor</div>
              <div className="cost-chip">light · codex</div>
            </div>
          </Reveal>

          <Reveal className="bento-card span6 cost-card" delay={120}>
            <CostCounter />
            <div className="cost-copy">
              <h3>Cost arbitrage</h3>
              <p>Agents read the graph&apos;s repo map instead of raw files.</p>
            </div>
            <div className="cost-chips">
              <div className="cost-chip">
                repo map · <span className="num hot-no">~824 tokens</span>
              </div>
              <div className="cost-chip hot">
                raw files · <span className="num">~248k tokens</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
