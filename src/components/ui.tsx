"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";

/**
 * Copy text to the clipboard, returning whether it succeeded. Falls back to a
 * hidden-textarea + execCommand path for insecure contexts (http on a LAN IP)
 * and older browsers where navigator.clipboard is unavailable.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Fade + translateY reveal on scroll. Ported from baton-shared.jsx. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  style = {},
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, vis] = useInView<HTMLDivElement>();
  const ease = "cubic-bezier(.2,.7,.2,1)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : `translateY(${y}px)`,
        transition: `opacity .8s ${ease} ${delay}ms, transform .8s ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

/** Click-to-copy install chip. Ported from baton-shared.jsx. */
export function CopyChip({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending reset on unmount so we never setState on a gone component.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(text);
    if (!ok) return; // copy failed → don't show a false "Copied!"
    setCopied(true);
    if (timer.current) clearTimeout(timer.current); // debounce rapid clicks
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      className="copy-chip"
      type="button"
      data-copied={copied || undefined}
      aria-label={copied ? "Copied to clipboard" : `Copy command: ${text}`}
      onClick={onCopy}
    >
      <span className="chip-dollar">$</span>
      <span className="chip-text">{label || text}</span>
      <span className="chip-copy" aria-live="polite">
        {copied ? (
          <>
            <CheckIcon size={13} strokeWidth={2.6} /> Copied!
          </>
        ) : (
          "copy"
        )}
      </span>
    </button>
  );
}

export function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.26L21.5 9.2l-4.8 4.5 1.2 6.6L12 17l-5.9 3.3 1.2-6.6L2.5 9.2l6.6-.94L12 2z" />
    </svg>
  );
}

export function CheckIcon({
  size = 36,
  color = "currentColor",
  strokeWidth = 2.2,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}
