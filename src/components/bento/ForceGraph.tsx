"use client";

import { useEffect, useRef } from "react";
import { useOnScreen, useReducedMotion } from "@/lib/hooks";
import { hexRgb } from "@/lib/util";

/** Force-directed node cluster (canvas). Ported from baton-bento.jsx. */
export default function ForceGraph({ accent }: { accent: string }) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ac = hexRgb(accent);
    const A = (a: number) => `rgba(${ac.r},${ac.g},${ac.b},${a})`;
    let W = 0,
      H = 0,
      raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, W * DPR);
      canvas.height = Math.max(1, H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const N = 38;
    const nodes = Array.from({ length: N }, (_, i) => ({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 60,
      vx: 0,
      vy: 0,
      hot: i % 9 === 0,
    }));
    const links: [number, number][] = [];
    for (let i = 1; i < N; i++) links.push([Math.floor(Math.random() * i), i]);
    for (let k = 0; k < 12; k++)
      links.push([Math.floor(Math.random() * N), Math.floor(Math.random() * N)]);

    function frame() {
      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < N; j++) {
          const b = nodes[j];
          let dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = Math.max(dx * dx + dy * dy, 16);
          const f = 22 / d2;
          dx *= f;
          dy *= f;
          a.vx += dx;
          a.vy += dy;
          b.vx -= dx;
          b.vy -= dy;
        }
        a.vx -= a.x * 0.002;
        a.vy -= a.y * 0.004;
      }
      for (const [i, j] of links) {
        const a = nodes[i],
          b = nodes[j];
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const f = (d - 34) * 0.008;
        const fx = (dx / d) * f,
          fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      const cx = W / 2,
        cy = H / 2;
      const bx = Math.max(20, W / 2 - 12),
        by = Math.max(16, H / 2 - 10);
      ctx!.clearRect(0, 0, W, H);
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = "rgba(255,255,255,0.10)";
      for (const [i, j] of links) {
        ctx!.beginPath();
        ctx!.moveTo(cx + nodes[i].x, cy + nodes[i].y);
        ctx!.lineTo(cx + nodes[j].x, cy + nodes[j].y);
        ctx!.stroke();
      }
      for (const n of nodes) {
        n.vx = Math.max(-1.5, Math.min(1.5, n.vx));
        n.vy = Math.max(-1.5, Math.min(1.5, n.vy));
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.85;
        n.vy *= 0.85;
        if (n.x < -bx) {
          n.x = -bx;
          n.vx *= -0.4;
        }
        if (n.x > bx) {
          n.x = bx;
          n.vx *= -0.4;
        }
        if (n.y < -by) {
          n.y = -by;
          n.vy *= -0.4;
        }
        if (n.y > by) {
          n.y = by;
          n.vy *= -0.4;
        }
        ctx!.fillStyle = n.hot ? A(0.9) : "rgba(255,255,255,0.45)";
        ctx!.beginPath();
        ctx!.arc(cx + n.x, cy + n.y, n.hot ? 2.6 : 1.7, 0, 7);
        ctx!.fill();
        if (n.hot) {
          ctx!.fillStyle = A(0.12);
          ctx!.beginPath();
          ctx!.arc(cx + n.x, cy + n.y, 8, 0, 7);
          ctx!.fill();
        }
      }
      if (!reduced && onScreen) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [accent, onScreen, reduced]);

  return (
    <div ref={hostRef} className="bento-viz">
      <canvas ref={canvasRef} className="graph-canvas" aria-hidden="true" />
    </div>
  );
}
