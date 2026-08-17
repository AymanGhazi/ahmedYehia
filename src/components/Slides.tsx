import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { Media } from "../data/media";
import { useI18n } from "../i18n/context";

/** Which photograph is up, and whether it is the full-size copy of it. */
export type Frame = { index: number; full: boolean };

type Turn = { from: Frame; dir: 1 | -1 };

/**
 * Slides a set of photographs in place — dragged, arrow-keyed, or picked off the
 * rule. Nothing moves on its own; the set holds the frame it was left on.
 *
 * `size` is how large the frame it fills is going to be. A card takes the small
 * copies, which is what a card is sized for, but keeps the full-size cover it
 * opened on rather than swapping a sharp image for a soft one. A frame running
 * most of the page width takes the full-size copies throughout.
 */
export function useSlides(images: Media[], start = 0, size: "thumb" | "full" = "thumb") {
  const { dir } = useI18n();
  const count = images.length;

  const [current, setCurrent] = useState<Frame>(() => ({ index: start, full: true }));
  const [turn, setTurn] = useState<Turn | null>(null);

  const held = useRef(current);
  const grab = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const srcOf = useCallback(
    (frame: Frame) => (frame.full || size === "full" ? images[frame.index].src : images[frame.index].thumb),
    [images, size],
  );

  const go = useCallback(
    (to: number) => {
      if (!count) return;
      const from = held.current;
      const index = ((to % count) + count) % count;
      if (index === from.index) return;

      const next = { index, full: false };
      held.current = next;
      setTurn({ from, dir: to > from.index ? 1 : -1 });
      setCurrent(next);
    },
    [count],
  );

  const move = useCallback((step: 1 | -1) => go(held.current.index + step), [go]);

  /* Once the set has been touched, the frames either side of it are fetched, so
     the next slide is a cut. Nothing is fetched ahead before that. */
  useEffect(() => {
    if (current.full || !count) return;
    for (const step of [1, -1]) {
      const near = new Image();
      near.src = srcOf({ index: (current.index + step + count) % count, full: false });
    }
  }, [current, count, srcOf]);

  const handlers = {
    onPointerDown: (e: PointerEvent) => {
      grab.current = { x: e.clientX, y: e.clientY };
    },
    onPointerCancel: () => {
      grab.current = null;
    },
    onPointerUp: (e: PointerEvent) => {
      const from = grab.current;
      grab.current = null;
      if (!from) return;

      const dx = e.clientX - from.x;
      if (Math.abs(dx) < 40 || Math.abs(e.clientY - from.y) > Math.abs(dx)) return;

      dragged.current = true;
      move((dir === "rtl" ? dx > 0 : dx < 0) ? 1 : -1);
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      move(e.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight") ? 1 : -1);
    },
  };

  /** True once for the click that ends a drag, so that click can be swallowed. */
  const afterDrag = () => {
    if (!dragged.current) return false;
    dragged.current = false;
    return true;
  };

  return { current, turn, go, move, handlers, afterDrag, srcOf, settle: () => setTurn(null) };
}

type Slides = ReturnType<typeof useSlides>;

/**
 * The two layers inside a frame: one leaving, one arriving. The slide is on the
 * layer rather than the image, which is free to carry the hover zoom — they
 * would otherwise fight over `transform`.
 */
export function SlideLayers({
  images,
  alt,
  slides,
}: {
  images: Media[];
  alt: string;
  slides: Slides;
}) {
  const { dir } = useI18n();
  const { current, turn, srcOf, settle } = slides;

  /* A forward slide arrives off the trailing edge and leaves by the leading one,
     which is the other way round in Arabic. */
  const shift = (towards: number) =>
    ({ "--shift": `${towards * (dir === "rtl" ? -1 : 1) * 32}%` }) as CSSProperties;

  const leaving = turn?.from;

  return (
    <>
      {turn && leaving && (
        <span className="slide" data-leaving="true" style={shift(-turn.dir)} onAnimationEnd={settle}>
          <img
            src={srcOf(leaving)}
            width={images[leaving.index].w}
            height={images[leaving.index].h}
            alt=""
            draggable={false}
            decoding="async"
          />
        </span>
      )}

      <span className="slide" data-moving={turn ? "true" : undefined} style={turn ? shift(turn.dir) : undefined}>
        <img
          src={srcOf(current)}
          width={images[current.index].w}
          height={images[current.index].h}
          alt={alt}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </span>
    </>
  );
}

/**
 * Position in the set, drawn like a setting-out rule: one tick per photograph,
 * the one on screen lit. The ticks are the control as well as the read-out.
 */
export function SlideRule({
  images,
  index,
  captions,
  label,
  onPick,
}: {
  images: Media[];
  index: number;
  captions?: Record<number, string>;
  label: string;
  onPick: (index: number) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="slide-rule" role="group" aria-label={label}>
      {images.map((image, i) => (
        <button
          key={image.src}
          type="button"
          className="slide-tick"
          data-current={i === index}
          aria-current={i === index}
          aria-label={t.lightbox.open(i + 1, images.length, captions?.[i + 1])}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}
