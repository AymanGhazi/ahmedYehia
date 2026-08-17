import { useCallback, useRef, useState } from "react";
import type { Media } from "../data/media";
import { useI18n } from "../i18n/context";

/**
 * Design against as-built, on one frame.
 *
 * Ahmed presents his own work this way — a render and the finished room split
 * down the middle of a single sheet. This makes that split draggable.
 *
 * The frame stays left-to-right in both languages. Mirroring it under RTL
 * would swap which photograph sits on which side, and the pair only reads as
 * one room if the render and the built room hold their positions.
 */
export function Comparator({ design, built, caption }: { design: Media; built: Media; caption?: string }) {
  const { t } = useI18n();
  const [x, setX] = useState(52);
  const box = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setX(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") setX((v) => Math.max(0, v - step));
    else if (e.key === "ArrowRight") setX((v) => Math.min(100, v + step));
    else if (e.key === "Home") setX(0);
    else if (e.key === "End") setX(100);
    else return;
    e.preventDefault();
  };

  return (
    <figure style={{ margin: 0 }}>
      <div
        ref={box}
        className="compare marks"
        dir="ltr"
        style={{ "--x": `${x}%` } as React.CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label={`${t.compare.design} / ${t.compare.built}. ${t.compare.hint}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x)}
        aria-valuetext={`${Math.round(x)}% ${t.compare.built}`}
        onKeyDown={onKeyDown}
        /* Chrome starts a native image drag a couple of pixels into the wipe,
           which fires pointercancel and kills the capture. Refuse it. */
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <img
          src={design.src}
          width={design.w}
          height={design.h}
          alt={`${t.compare.design} — ${caption ?? ""}`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <img
          className="compare__top"
          src={built.src}
          width={built.w}
          height={built.h}
          alt={`${t.compare.built} — ${caption ?? ""}`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        <span className="compare__tag compare__tag--a">{t.compare.design}</span>
        <span className="compare__tag compare__tag--b">{t.compare.built}</span>

        <span className="compare__handle" aria-hidden="true">
          <span className="compare__grip">
            <i />
            <i />
            <i />
          </span>
        </span>
      </div>

      {caption && (
        <figcaption className="figcap">
          <b>{t.compare.drag}</b>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
