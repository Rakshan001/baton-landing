"use client";

import { useState } from "react";
import { Reveal, Eyebrow, GitHubIcon, StarIcon } from "@/components/ui";

const QUICKSTART =
  "git clone https://github.com/baton-dev/baton && npm run build && node dist/cli.js serve --write";

const INITIALS = ["MK", "JR", "AS", "TL", "Ny", "DV", "EC"];

export default function OpenSource() {
  const [copied, setCopied] = useState(false);
  return (
    <section className="oss" id="opensource">
      <div className="wrap">
        <Reveal>
          <Eyebrow>Open source</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2>Baton is open source.</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="oss-sub">
            Plain markdown, plain git, plain HTTP. Nothing proprietary between you and your agents.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="oss-chips">
            <span className="oss-chip">
              <StarIcon size={13} /> <span className="val">4,182</span> stars
            </span>
            <span className="oss-chip">
              License · <span className="val">MIT</span>
            </span>
            <span className="oss-chip">
              <span className="val">23</span> contributors
            </span>
          </div>
        </Reveal>
        <Reveal delay={260}>
          <div className="avatars" aria-label="Contributors">
            {INITIALS.map((x) => (
              <span key={x} className="avatar">
                {x}
              </span>
            ))}
            <span className="avatar more">+16</span>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="cta-row">
            <a className="btn btn-primary" href="#top">
              <GitHubIcon size={17} /> Star on GitHub
            </a>
            <a className="btn btn-ghost" href="#top">
              Good first issues
            </a>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <button
            className="quickstart"
            type="button"
            aria-label="Copy quickstart command"
            onClick={() => {
              navigator.clipboard?.writeText(QUICKSTART).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
          >
            <span className="dollar">$</span>
            <span>{QUICKSTART}</span>
            <span className="qc">{copied ? "copied" : "copy"}</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
