import { Link } from "react-router-dom";
import { useI18n, imageAt } from "../i18n/context";
import { Eyebrow, Reveal, Rule, Shot } from "../components/primitives";
import { ProjectIndex } from "../components/ProjectIndex";

const span = (i: number) => (i % 5 === 0 ? "card--wide" : i % 5 === 1 ? "card--narrow" : "card");

export default function Work() {
  const { t, projects, totalImages } = useI18n();

  return (
    <>
      <section className="section section--tight wrap page-top">
        <div className="split" style={{ alignItems: "end" }}>
          <div>
            <Eyebrow>{t.work.eyebrow}</Eyebrow>
            <h1 className="display" style={{ fontSize: "clamp(2.1rem, 5.2vw, 4.4rem)" }}>
              {t.work.title}
            </h1>
          </div>
          <p className="prose" style={{ maxWidth: "52ch" }}>
            {t.work.blurb(projects.length, totalImages)}
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: "clamp(56px, 8vw, 110px)" }}>
        <ProjectIndex items={projects} />
      </section>

      <section className="section wrap">
        <Rule soft />
        <div style={{ height: "clamp(28px, 4vw, 48px)" }} />
        <Eyebrow>{t.work.allProjects}</Eyebrow>

        <div className="work-grid">
          {projects.map((project, i) => (
            <Reveal key={project.slug} className={span(i)} delay={(i % 3) * 60}>
              <Link className="card" to={`/work/${project.slug}`} style={{ gridColumn: "auto" }}>
                <Shot image={imageAt(project, project.cardIndex)} alt={project.title} />
                <div className="card__meta">
                  <div>
                    <h2 className="card__title">{project.title}</h2>
                    <p className="card__sub">
                      {project.location} · <bdi dir="ltr">{project.years}</bdi>
                    </p>
                  </div>
                  <bdi className="label" style={{ flex: "none", margin: 0 }} dir="ltr">
                    {project.ref}
                  </bdi>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
