import { useCallback, useEffect } from "react";
import type { Media } from "../data/media";
import { useScrollLock } from "../lib/hooks";
import { useI18n } from "../i18n/context";

export function Lightbox({
  images,
  index,
  captions,
  title,
  onClose,
  onIndex,
}: {
  images: Media[];
  index: number;
  captions?: Record<number, string>;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const { t, dir } = useI18n();
  useScrollLock(true);

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

  const current = images[index];
  const caption = captions?.[index + 1];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title}>
      <img src={current.src} width={current.w} height={current.h} alt={caption ?? title} />

      <div className="lightbox__bar">
        <span>
          <span dir="ltr">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          {caption ? ` · ${caption}` : ""}
        </span>
        <div className="lightbox__nav">
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
    </div>
  );
}
