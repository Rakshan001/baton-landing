"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Fires once when the element scrolls into view, then disconnects.
 * Ported from the prototype's `useInView` (baton-shared.jsx).
 */
export function useInView<T extends Element = HTMLDivElement>(
  opts: { threshold?: number; rootMargin?: string } = {}
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          ob.disconnect();
        }
      },
      { threshold: opts.threshold ?? 0.25, rootMargin: opts.rootMargin ?? "0px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, vis];
}

/**
 * Stays live (doesn't disconnect) — used to pause canvas loops offscreen.
 * Ported from the prototype's `useOnScreen`.
 */
export function useOnScreen<T extends Element = HTMLDivElement>(
  threshold = 0.05
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      threshold,
    });
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return [ref, on];
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Reactive prefers-reduced-motion (SSR-safe; false on the server). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

/** True while the document tab is visible — for pausing rAF loops. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true
  );
}
