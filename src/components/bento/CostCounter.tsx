"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";

/** Counts 0 → 300× when scrolled into view. Ported from baton-bento.jsx. */
export default function CostCounter() {
  const [ref, vis] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!vis || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setN(Math.round(300 * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vis, reduced]);
  return (
    <div ref={ref} className="cost-big">
      ~{reduced ? 300 : n}
      <span className="x">×</span>
    </div>
  );
}
