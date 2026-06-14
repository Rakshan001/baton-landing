"use client";

import { Reveal, Eyebrow } from "@/components/ui";

export default function Problem() {
  return (
    <section className="problem">
      <div className="wrap">
        <Reveal>
          <Eyebrow>The problem</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <p className="line">
            You run three AI coding agents. They don&apos;t know about each other.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p className="line">
            Two of them just edited <span className="hl">the same file</span>.
          </p>
        </Reveal>
        <Reveal delay={380}>
          <p className="line">
            Your expensive agent hit its limit mid-task — and all that context{" "}
            <span className="dead">died with the session</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
