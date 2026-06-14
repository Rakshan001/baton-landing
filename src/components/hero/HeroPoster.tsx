import { ACCENT } from "@/lib/util";

/**
 * Static poster frame of the agent-pass scene. Rendered:
 *  - as the dynamic-import loading fallback (so the hero paints instantly, no LCP block)
 *  - permanently under prefers-reduced-motion (no WebGL, no animation)
 * Weighted to the right so the hero copy (left) stays readable behind the fade.
 */
export default function HeroPoster() {
  const nodes = [
    { x: 560, y: 150, tag: "CC", name: "Claude Code", active: true },
    { x: 770, y: 250, tag: "CU", name: "Cursor", active: false },
    { x: 600, y: 400, tag: "CX", name: "Codex", active: false },
    { x: 410, y: 300, tag: "GE", name: "Gemini", active: false },
  ];
  return (
    <svg
      className="hero-canvas hero-poster"
      viewBox="0 0 920 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hp-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="hp-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* faint lattice */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => (
            <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          ))
        )}
      </g>

      {/* baton arc Claude Code -> Cursor */}
      <path
        d="M 560 150 Q 620 110 770 250"
        fill="none"
        stroke={ACCENT}
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="5 7"
      />

      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.tag}>
          <circle cx={n.x} cy={n.y} r="78" fill="url(#hp-node)" />
          <circle
            cx={n.x}
            cy={n.y}
            r="26"
            fill="rgba(255,255,255,0.045)"
            stroke={n.active ? ACCENT : "rgba(255,255,255,0.20)"}
            strokeWidth="1.2"
            strokeOpacity={n.active ? 0.85 : 1}
          />
          <text
            x={n.x}
            y={n.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--mono)"
            fontSize="11"
            fontWeight="600"
            fill={n.active ? ACCENT : "rgba(255,255,255,0.6)"}
          >
            {n.tag}
          </text>
          <text
            x={n.x}
            y={n.y + 50}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="10.5"
            fill="rgba(255,255,255,0.55)"
          >
            {n.name}
          </text>
        </g>
      ))}

      {/* baton mid-flight */}
      <g filter="url(#hp-glow)">
        <line
          x1="648"
          y1="150"
          x2="690"
          y2="174"
          stroke={ACCENT}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <line
          x1="660"
          y1="157"
          x2="678"
          y2="167"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
