import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n, type Project } from "../i18n/context";
import { Reveal } from "./primitives";
import { SlideLayers, SlideRule, useSlides } from "./Slides";
import { Lightbox } from "./Lightbox";

/**
 * The work as a contact sheet: one card per project, in deck order. A card slides
 * through its own photographs where it stands, and clicking the photograph opens
 * whatever frame is up as a quick look. The reference code is the way through to
 * the full project sheet for anyone who wants the specification.
 */

/** Woven spans, and a full-width card for a card left alone on the last row. */
const spanFor = (i: number, total: number) => {
  if (i === total - 1 && i % 4 === 0) return "card--full";
  const step = i % 4;
  return step === 0 ? "card--wide" : step === 1 ? "card--narrow" : "card";
};

function QuickCard({ project, onOpen }: { project: Project; onOpen: (index: number) => void }) {
  const { t } = useI18n();
  const count = project.images.length;
  const slides = useSlides(project.images, project.cardIndex - 1);
  const at = slides.current.index;

  return (
    <div className="card" style={{ gridColumn: "auto" }}>
      <button
        type="button"
        className="quick"
        {...slides.handlers}
        onClick={() => {
          if (!slides.afterDrag()) onOpen(at);
        }}
        aria-label={t.work.quickOpen(project.title, count)}
      >
        <span className="frame frame--zoom">
          <SlideLayers images={project.images} alt={project.title} slides={slides} />
        </span>
        <span className="quick__badge" aria-hidden="true">
          {t.work.quickView}
        </span>
      </button>

      <SlideRule
        images={project.images}
        index={at}
        captions={project.captions}
        label={t.work.photos(count)}
        onPick={slides.go}
      />

      <div className="card__meta">
        <div>
          <h3 className="card__title">{project.title}</h3>
          <p className="card__sub">
            {project.location} · <bdi dir="ltr">{project.years}</bdi> ·{" "}
            <bdi dir="ltr">
              {String(at + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </bdi>
          </p>
        </div>
        <Link className="quick__ref" to={`/work/${project.slug}`} aria-label={t.work.open(project.ref)}>
          <bdi dir="ltr">{project.ref}</bdi>
        </Link>
      </div>
    </div>
  );
}

export function WorkQuickView({ items }: { items: Project[] }) {
  const [open, setOpen] = useState<{ slug: string; index: number } | null>(null);

  const active = open ? items.find((project) => project.slug === open.slug) : undefined;

  return (
    <>
      <div className="work-grid">
        {items.map((project, i) => (
          <Reveal key={project.slug} className={spanFor(i, items.length)} delay={(i % 3) * 60}>
            <QuickCard project={project} onOpen={(index) => setOpen({ slug: project.slug, index })} />
          </Reveal>
        ))}
      </div>

      {active && open && (
        <Lightbox
          images={active.images}
          index={open.index}
          captions={active.captions}
          title={active.title}
          href={`/work/${active.slug}`}
          onClose={() => setOpen(null)}
          onIndex={(index) => setOpen({ slug: active.slug, index })}
        />
      )}
    </>
  );
}
