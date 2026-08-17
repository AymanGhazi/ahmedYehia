import { useEffect, useRef, useState } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveals an element once it has entered the viewport, and leaves it revealed. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(() => reducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, shown]);

  return { ref, shown };
}

/** Hides the header while scrolling down, brings it back on the way up. */
export function useHideOnScroll(threshold = 140) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last.current;
      setHidden(goingDown && y > threshold);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}

/** True once the page has been carried far enough down that the top is gone. */
export function useScrolledPast(threshold = 700) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}

type Lenis = {
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (
    target: number | HTMLElement,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
};

/** The momentum scroller, while it is running. */
let momentum: Lenis | null = null;

/**
 * Every programmatic move down the page goes through here. Momentum scrolling
 * keeps its own idea of where the page is and writes it back every frame, so a
 * plain window.scrollTo is undone before it lands — the scroller has to be
 * asked instead. Without it (or with motion turned down) it is the native call.
 */
export function scrollPageTo(target: number | HTMLElement, offset = 0) {
  const immediate = reducedMotion();

  if (momentum) {
    momentum.scrollTo(target, { offset, immediate });
    return;
  }

  const top =
    (typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY) +
    offset;
  window.scrollTo({ top, behavior: immediate ? ("instant" as ScrollBehavior) : "smooth" });
}

/** Momentum scrolling, skipped entirely when the visitor asks for less motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    let frame = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      /* The scroller takes the wheel off the document, which otherwise leaves
         anything with its own scrollbar — a zoomed page in the reader, a rail of
         thumbnails — dead under the wheel. It hands the gesture back when the
         pointer is over a box that can take it. */
      momentum = new Lenis({
        duration: 1.05,
        lerp: 0.1,
        allowNestedScroll: true,
      }) as unknown as Lenis;
      const loop = (time: number) => {
        momentum?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      momentum?.destroy();
      momentum = null;
    };
  }, []);
}

/** Locks page scroll while an overlay is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
