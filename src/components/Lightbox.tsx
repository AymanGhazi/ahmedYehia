import { useCallback, useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import { Link } from "react-router-dom";
import type { Media } from "../data/media";
import { useScrollLock } from "../lib/hooks";
import { useI18n } from "../i18n/context";

/**
 * Quick look at one project — the deck flipped through without leaving the page.
 * Arrows, swipe, or the thumbnail rail move between frames; escape or the ground
 * around the photograph closes it.
 */
export function Lightbox({
  images,
  index,
  captions,
  title,
  href,
  onClose,
  onIndex,
}: {
  images: Media[];
  index: number;
  captions?: Record<number, string>;
  title: string;
  /** Link to the full project page, offered in the bar when given. */
  href?: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const { t, dir } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  useScrollLock(true);

  /* Focus moves into the dialog and back to whatever opened it. Without that the
     arrow keys reach the card or gallery underneath as well as this. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => opener?.focus?.();
  }, []);

  const step = useCallback(
    (delta: number) => onIndex((index + delta + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === forward) step(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step, dir]);

  /* The next frame is fetched while this one is being read, so a flip is instant. */
  useEffect(() => {
    for (const delta of [1, -1]) {
      const preload = new Image();
      preload.src = images[(index + delta + images.length) % images.length].src;
    }
  }, [index, images]);

  useEffect(() => {
    rail.current
      ?.querySelector<HTMLElement>('[data-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    swipe.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    if (Math.abs(dx) < 44 || Math.abs(touch.clientY - start.y) > Math.abs(dx)) return;
    /* Dragging the photograph away brings the next one in — mirrored in Arabic. */
    step((dir === "rtl" ? dx > 0 : dx < 0) ? 1 : -1);
  };

  const current = images[index];
  const caption = captions?.[index + 1];
  const groundClose = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={panel}
      onClick={groundClose}
    >
      <div className="lightbox__stage" onClick={groundClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img src={current.src} width={current.w} height={current.h} alt={caption ?? title} />

        <button
          type="button"
          className="lightbox__step lightbox__step--prev"
          onClick={() => step(-1)}
          aria-label={t.lightbox.prev}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          className="lightbox__step lightbox__step--next"
          onClick={() => step(1)}
          aria-label={t.lightbox.next}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="lightbox__bar">
        <span>
          <span dir="ltr">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          {caption ? ` · ${caption}` : ` · ${title}`}
        </span>
        <div className="lightbox__nav">
          {href && (
            <Link to={href} onClick={onClose}>
              {t.lightbox.full}
            </Link>
          )}
          <button type="button" onClick={() => step(-1)}>
            {t.lightbox.prev}
          </button>
          <button type="button" onClick={() => step(1)}>
            {t.lightbox.next}
          </button>
          <button type="button" onClick={onClose}>
            {t.lightbox.close}
          </button>
        </div>
      </div>

      <div className="lightbox__rail" ref={rail} aria-label={t.lightbox.jump} role="group">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            className="lightbox__thumb"
            data-current={i === index}
            onClick={() => onIndex(i)}
            aria-label={t.lightbox.open(i + 1, images.length, captions?.[i + 1])}
            aria-current={i === index}
          >
            <img src={image.thumb} width={image.w} height={image.h} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
