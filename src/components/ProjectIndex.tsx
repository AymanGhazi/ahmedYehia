import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n, type Project } from "../i18n/context";

/**
 * The work presented the way it is actually handed over: as a schedule.
 * Each line opens like a BOQ item — spec on one side, four frames on the other.
 */
export function ProjectIndex({ items }: { items: Project[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);
  const base = useId();

  return (
    <div className="index">
      {items.map((project) => {
        const isOpen = open === project.slug;
        const panelId = `${base}-${project.slug}`;
        const strip = project.images.slice(0, 4);

        return (
          <article className="row" key={project.slug} data-open={isOpen}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="row__head"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : project.slug)}
              >
                <bdi className="row__ref" dir="ltr">
                  {project.ref}
                </bdi>
                <span className="row__title">{project.title}</span>
                <span className="row__client">{project.location}</span>
                <bdi className="row__years" dir="ltr">
                  {project.years}
                </bdi>
                <span className="row__toggle" aria-hidden="true" />
              </button>
            </h3>

            <div className="row__body" id={panelId} role="region" aria-label={project.title}>
              <div className="row__bodyIn">
                <div className="row__panel">
                  <span aria-hidden="true" />
                  <div className="row__panelBody">
                    <div>
                      <p className="row__summary">{project.summary}</p>

                      <dl className="spec">
                        <dt>{t.work.studio}</dt>
                        <dd>{project.studio}</dd>
                        <dt>{t.work.role}</dt>
                        <dd>{project.role}</dd>
                        <dt>{t.work.scope}</dt>
                        <dd>{project.scope.join(" · ")}</dd>
                      </dl>

                      <p style={{ margin: "22px 0 0" }}>
                        <Link className="btn" to={`/work/${project.slug}`} tabIndex={isOpen ? 0 : -1}>
                          {t.work.open(project.ref)}
                          <span className="arrow" aria-hidden="true">
                            →
                          </span>
                        </Link>
                      </p>
                    </div>

                    <div className="row__strip">
                      {strip.map((img) => (
                        <Link
                          className="frame frame--zoom"
                          key={img.src}
                          to={`/work/${project.slug}`}
                          tabIndex={isOpen ? 0 : -1}
                          aria-label={project.title}
                        >
                          <img src={img.thumb} width={img.w} height={img.h} alt="" loading="lazy" decoding="async" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
