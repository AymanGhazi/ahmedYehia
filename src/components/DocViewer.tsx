import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { Media } from "../data/media";
import { useScrollLock } from "../lib/hooks";
import { useI18n } from "../i18n/context";
import { useSlides, SlideLayers, SlideArrows } from "./Slides";

/**
 * The deck read on the page itself — one rendered page at a time, swiped,
 * dragged or arrow-keyed, the same way every other set of images on this site
 * moves. Pages rather than an embedded PDF because a PDF in a frame is the one
 * thing phones reliably refuse to draw, and because a page is a hundred and
 * fifty kilobytes where the file is five and a half megabytes.
 *
 * The file itself stays one tap away in the bar, for whoever wants to keep it.
 */

/* Where the button lands, and as far as two fingers may go. Past four times the
   fitted size there is no more detail in the page to find. */
const STEP = 2;
const MAX = 4;

export function DocViewer({
  title,
  pages,
  href,
  file,
  meta,
  onClose,
}: {
  title: string;
  pages: Media[];
  href: string;
  /** Name the visitor ends up with on disk. */
  file: string;
  meta: string;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  /* How many times the size it was fitted at the page is drawn. One is the whole
     sheet on screen; the button steps to STEP, two fingers go anywhere between. */
  const [scale, setScale] = useState(1);
  const zoom = scale > 1;
  const slides = useSlides(pages, 0, "full");
  const { current, move, go, handlers } = slides;
  /* The key handler belongs to the dialog, the pointer handlers to the page.
     Spreading all of them onto the page as well would step the deck twice for
     one arrow press, once on the way up to the dialog. */
  const { onKeyDown, ...drag } = handlers;
  useScrollLock(true);

  /* Focus moves into the dialog and back to the button that opened it. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => opener?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* A page held enlarged is scrolled, not swiped — the drag would fight the
     pan. Leaving a page also returns to reading the next one whole. */
  useEffect(() => {
    setScale(1);
  }, [current.index]);

  /* The size the page is drawn at is written straight onto the box during a
     resize, so a pinch is not a render a frame. This puts the two back in step
     whenever the size is set from anywhere else — the button, a new page — and
     opens the page at its head rather than its middle. Centring looks
     considerate on a drawing and is useless on a CV, where it hides the edge
     every line starts from. */
  const live = useRef(1);
  const held = useRef<{ gap: number; scale: number } | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || held.current) return;
    live.current = scale;
    el.style.setProperty("--doc-scale", String(scale));
    if (scale === 1) el.scrollTo({ left: 0, top: 0 });
  }, [scale]);

  /**
   * Redraws the page at a new size, holding whatever sits under `at` — the point
   * between two fingers, or the pointer — where it already is. Without that the
   * page grows from its corner and the thing being looked at slides off screen.
   *
   * The size goes onto the box directly and into React only when it crosses
   * between whole and enlarged, which is the only part of it the rest of the
   * dialog reads. A pinch would otherwise redraw thirty-eight thumbnails a frame.
   */
  const resize = useCallback((to: number, at?: { x: number; y: number }, commit = false) => {
    const el = stage.current;
    if (!el) return;

    const from = live.current;
    const next = Math.min(MAX, Math.max(1, to));
    const box = el.getBoundingClientRect();
    const x = at ? at.x - box.left : el.clientWidth / 2;
    const y = at ? at.y - box.top : el.clientHeight / 2;
    /* Where on the sheet itself that point falls, in whole-page units. */
    const px = (el.scrollLeft + x) / from;
    const py = (el.scrollTop + y) / from;

    live.current = next;
    el.style.setProperty("--doc-scale", String(next));
    el.scrollLeft = px * next - x;
    el.scrollTop = py * next - y;

    if (commit || next > 1 !== from > 1) setScale(next);
  }, []);

  /* One finger carries the enlarged page about, two resize it. At whole size the
     single finger is left to the deck, which reads it as a swipe to the next
     page. Touch is handled here rather than left to the box's own scrolling
     because a pinch has to be taken off the browser to be caught at all. */
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const grab = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const panned = useRef(false);
  /* Where the gesture began and whether it has gone anywhere since — a tap is a
     touch that did not. Kept apart from `panned`, which is only there to stop the
     click ending a carry from being read as a click on the ground, and which the
     ground itself clears; a pinch sends no click, so it would never be cleared. */
  const origin = useRef<{ x: number; y: number } | null>(null);
  const still = useRef(false);
  const tapped = useRef(0);

  const gap = () => {
    const [a, b] = [...touches.current.values()];
    return { span: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };

  const track = {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      const el = stage.current;
      if (!el || e.button !== 0) return;
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (touches.current.size === 2) {
        /* A second finger turns a swipe or a carry into a resize. The deck is
           told the swipe is off, or it steps a page as the fingers come up. */
        drag.onPointerCancel();
        grab.current = null;
        panned.current = true;
        still.current = false;
        const two = gap();
        held.current = { gap: two.span || 1, scale: live.current };
        for (const id of touches.current.keys()) {
          if (!el.hasPointerCapture(id)) el.setPointerCapture(id);
        }
        return;
      }

      if (touches.current.size === 1) {
        origin.current = { x: e.clientX, y: e.clientY };
        still.current = true;
        if (live.current > 1) {
          grab.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
          panned.current = false;
          el.setPointerCapture(e.pointerId);
        }
      }
    },

    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const el = stage.current;
      if (!el || !touches.current.has(e.pointerId)) return;
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const start = held.current;
      if (start && touches.current.size > 1) {
        const two = gap();
        resize(start.scale * (two.span / start.gap), { x: two.x, y: two.y });
        return;
      }

      const was = origin.current;
      if (was && (Math.abs(e.clientX - was.x) > 3 || Math.abs(e.clientY - was.y) > 3)) {
        still.current = false;
      }

      const from = grab.current;
      if (!from) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) panned.current = true;
      el.scrollLeft = from.left - dx;
      el.scrollTop = from.top - dy;
    },

    onPointerUp: (e: PointerEvent<HTMLDivElement>) => {
      const el = stage.current;
      touches.current.delete(e.pointerId);
      if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

      if (held.current && touches.current.size < 2) {
        /* The finger still down was half of a pinch, not the start of a carry. */
        held.current = null;
        touches.current.clear();
        grab.current = null;
        setScale(live.current);
        return;
      }

      if (touches.current.size === 0) {
        grab.current = null;
        origin.current = null;
        /* Two taps in quick succession step between whole and enlarged, at the
           point tapped — the other half of how a photograph is read on a phone. */
        if (e.pointerType !== "mouse" && still.current) {
          const now = e.timeStamp;
          if (now - tapped.current < 320) {
            resize(live.current > 1 ? 1 : STEP, { x: e.clientX, y: e.clientY }, true);
            tapped.current = 0;
          } else tapped.current = now;
        }
        still.current = false;
      }
    },

    onPointerCancel: (e: PointerEvent<HTMLDivElement>) => {
      touches.current.delete(e.pointerId);
      if (touches.current.size < 2 && held.current) {
        held.current = null;
        touches.current.clear();
        setScale(live.current);
      }
      grab.current = null;
      origin.current = null;
      still.current = false;
    },
  };

  /* A trackpad pinch reaches the page as a wheel with the control key held, and
     so does the browser's own zoom — which is why it has to be taken here rather
     than left to bubble. React registers wheel passively, so it cannot be. */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: globalThis.WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      resize(live.current * Math.exp(-e.deltaY / 160), { x: e.clientX, y: e.clientY }, true);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [resize]);

  /* The button holds the top corner of the sheet rather than its middle, so the
     page opens at its head — centring looks considerate on a drawing and is
     useless on a CV, where it hides the edge every line starts from. A pinch or
     a double tap holds the point touched instead, which is the whole of what
     either gesture means. */
  const stepZoom = () => {
    const box = stage.current?.getBoundingClientRect();
    resize(zoom ? 1 : STEP, box && { x: box.left, y: box.top }, true);
  };

  /* The arrows step the deck at page size and carry the page about once it is
     enlarged, where stepping would only throw away the place being read. */
  const onStageKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (zoom && el) {
      const step = 90;
      const by: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
        PageUp: [0, -el.clientHeight * 0.9],
        PageDown: [0, el.clientHeight * 0.9],
      };
      const to = by[e.key];
      if (to) {
        e.preventDefault();
        el.scrollBy({ left: to[0], top: to[1], behavior: "smooth" });
        return;
      }
    }
    onKeyDown(e);
  };

  const groundClose = (e: MouseEvent) => {
    /* A drag that ends on the ground is a pan finishing, not a click on it. */
    if (panned.current) {
      panned.current = false;
      return;
    }
    if (e.target === e.currentTarget) onClose();
  };

  const page = `${current.index + 1} / ${pages.length}`;

  return (
    <div
      className="docview"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={panel}
      onClick={groundClose}
      onKeyDown={onStageKeyDown}
      /* The momentum scroller takes the wheel off the document; this hands it
         back to the box under the pointer, which is the enlarged page. */
      data-lenis-prevent
    >
      <button type="button" className="overlay-x" onClick={onClose} aria-label={t.doc.close}>
        <span aria-hidden="true">✕</span>
      </button>

      <div
        className="docview__stage"
        data-zoom={zoom}
        ref={stage}
        onClick={groundClose}
        {...track}
      >
        <div
          className="docview__page"
          {...(zoom ? {} : drag)}
          aria-live="polite"
          aria-label={t.doc.page(current.index + 1, pages.length)}
        >
          <SlideLayers images={pages} alt={t.doc.pageAlt(title, current.index + 1)} slides={slides} />
        </div>

        {!zoom && pages.length > 1 && <SlideArrows move={move} />}
      </div>

      {/* One row on a phone, and every target at least 44px tall. */}
      <div className="docview__bar">
        <div className="docview__pager">
          <button
            type="button"
            className="docview__step"
            onClick={() => move(-1)}
            disabled={pages.length < 2}
            aria-label={t.lightbox.prev}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <span className="docview__count" dir="ltr">
            {page}
          </span>
          <button
            type="button"
            className="docview__step"
            onClick={() => move(1)}
            disabled={pages.length < 2}
            aria-label={t.lightbox.next}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <p className="docview__meta">
          {title} · <span dir="ltr">{meta}</span>
        </p>

        <div className="docview__nav">
          <button type="button" onClick={stepZoom} aria-pressed={zoom}>
            {zoom ? t.doc.fit : t.doc.zoom}
          </button>
          {/* The word goes when the bar cannot hold it; the label carries it. */}
          <a href={href} download={file} type="application/pdf" aria-label={`${t.doc.download} — ${meta}`}>
            <span className="docview__long">{t.doc.download}</span>
            <span className="docview__icon arrow arrow--down" aria-hidden="true">
              ↓
            </span>
          </a>
          <button type="button" className="docview__close" onClick={onClose}>
            {t.doc.close}
          </button>
        </div>
      </div>

      {pages.length > 1 && (
        <div className="docview__rail" role="group" aria-label={t.doc.jump}>
          {pages.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className="docview__thumb"
              data-current={i === current.index}
              aria-current={i === current.index}
              aria-label={t.doc.page(i + 1, pages.length)}
              onClick={() => go(i)}
            >
              <img src={p.thumb} width={p.w} height={p.h} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
