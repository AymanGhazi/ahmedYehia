import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useI18n, imageAt, type Project as ProjectRecord } from "../i18n/context";
import { Eyebrow, Reveal, Rule } from "../components/primitives";
import { Comparator } from "../components/Comparator";
import { Lightbox } from "../components/Lightbox";
import { SlideLayers, SlideRule, useSlides } from "../components/Slides";

/**
 * The project's photographs as one frame slid through, rather than a wall of
 * thumbnails: drag it, arrow-key it, or pick a frame off the rule under it. The
 * photograph itself opens full size, and closing that leaves the frame on
 * whichever photograph the reader got to.
 */
function Gallery({ project }: { project: ProjectRecord }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const slides = useSlides(project.images, 0, "full");

  const at = slides.current.index;
  const count = project.images.length;
  const caption = project.captions?.[at + 1];
  const label = t.project.frames(count, project.ref);

  return (
    <Reveal>
      <figure className="slider">
        <button
          type="button"
          className="shot"
          {...slides.handlers}
          onClick={() => {
            if (!slides.afterDrag()) setOpen(at);
          }}
          aria-label={t.lightbox.open(at + 1, count, caption)}
        >
          <span className="frame frame--zoom slider__frame">
            <SlideLayers images={project.images} alt={caption ?? project.title} slides={slides} />
          </span>
        </button>

        <SlideRule
          images={project.images}
          index={at}
          captions={project.captions}
          label={label}
          onPick={slides.go}
        />

        <figcaption className="figcap">
          <b>
            <bdi dir="ltr">
              {String(at + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </bdi>
          </b>
          {caption ?? ""}
        </figcaption>
      </figure>

      {open !== null && (
        <Lightbox
          images={project.images}
          index={open}
          captions={project.captions}
          title={project.title}
          onClose={() => {
            slides.go(open);
            setOpen(null);
          }}
          onIndex={setOpen}
        />
      )}
    </Reveal>
  );
}

export default function Project() {
  const { slug = "" } = useParams();
  const { t, projects, bySlug } = useI18n();

  const project = bySlug(slug);
  if (!project) return <Navigate to="/work" replace />;

  const hero = imageAt(project, project.heroIndex);
  const at = projects.findIndex((x) => x.slug === project.slug);
  const next = projects[(at + 1) % projects.length];

  return (
    <>
      <section className="wrap page-top page-top--short">
        <p className="label" style={{ marginBottom: "clamp(22px, 3vw, 36px)" }}>
          <Link to="/work" className="link">
            {t.project.index}
          </Link>
          {" · "}
          <bdi dir="ltr">{project.ref}</bdi>
        </p>

        <div className="split" style={{ alignItems: "end", marginBottom: "clamp(26px, 4vw, 46px)" }}>
          <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4.4vw, 3.5rem)" }}>
            {project.title}
          </h1>
          <div>
            <p className="lede">{project.subtitle}</p>
            <ul className="swatches swatches--lg" style={{ marginTop: 22 }} aria-label={t.project.materials}>
              {project.swatches.map((colour, i) => (
                <li key={project.materials[i]} style={{ background: colour }} title={project.materials[i]} />
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="marks">
          <figure style={{ margin: 0 }}>
            <span className="frame" style={{ aspectRatio: "3 / 2" }}>
              <img
                src={hero.src}
                width={hero.w}
                height={hero.h}
                alt={project.title}
                style={{ objectPosition: "50% 42%" }}
                fetchPriority="high"
              />
            </span>
          </figure>
        </Reveal>
      </section>

      {/* --------------------------------------------------- title block -- */}
      <section className="section section--tight wrap">
        <Reveal mode="rise">
          <dl className="titleblock">
            <div>
              <dt>{t.project.summary}</dt>
              <dd className="titleblock__summary">{project.summary}</dd>
            </div>
            <div>
              <dt>{t.project.client}</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>{t.project.location}</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>{t.project.studio}</dt>
              <dd>{project.studio}</dd>
            </div>
            <div>
              <dt>{t.project.period}</dt>
              <dd><bdi dir="ltr">{project.years}</bdi></dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* -------------------------------------------------- scope & spec -- */}
      <section className="section section--tight wrap">
        <div className="cols-2">
          <Reveal mode="rise">
            <Eyebrow>{t.project.scope}</Eyebrow>
            <ul className="list-plain list-rule">
              {project.scope.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <p className="label" style={{ margin: "28px 0 12px" }}>
              {t.project.role}
            </p>
            <p className="prose">{project.role}</p>
          </Reveal>

          <Reveal mode="rise" delay={80}>
            <Eyebrow>{t.project.materials}</Eyebrow>
            <ul className="swatch-key">
              {project.materials.map((m, i) => (
                <li key={m}>
                  <i style={{ background: project.swatches[i] }} />
                  {m}
                </li>
              ))}
            </ul>

            <p className="label" style={{ margin: "32px 0 12px" }}>
              {t.project.onSite}
            </p>
            <ul className="ledger__lines">
              {project.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {project.pull && (
        <section className="section section--tight wrap">
          <Rule soft />
          <div style={{ height: "clamp(30px, 4vw, 54px)" }} />
          <Reveal mode="rise">
            <blockquote style={{ margin: 0 }}>
              <p className="pull">{project.pull.text}</p>
              <footer className="pull__src">{project.pull.source}</footer>
            </blockquote>
          </Reveal>
        </section>
      )}

      {project.compare && (
        <section className="section section--tight wrap">
          <Eyebrow>{t.project.designAgainst}</Eyebrow>
          <Reveal>
            <Comparator
              design={imageAt(project, project.compare.design)}
              built={imageAt(project, project.compare.built)}
              caption={project.compareCaption}
            />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------- gallery -- */}
      <section className="section wrap">
        <Eyebrow>{t.project.frames(project.images.length, project.ref)}</Eyebrow>
        <Gallery project={project} />
      </section>

      {/* ---------------------------------------------------------- next -- */}
      <section className="section section--tight wrap">
        <Rule />
        <Link to={`/work/${next.slug}`} className="card" style={{ display: "block", paddingTop: "clamp(24px, 3vw, 40px)" }}>
          <p className="label" style={{ marginBottom: 12 }}>
            {t.project.next} · <bdi dir="ltr">{next.ref}</bdi>
          </p>
          <h2 className="display" style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.9rem)" }}>
            {next.title}
          </h2>
        </Link>
      </section>
    </>
  );
}
