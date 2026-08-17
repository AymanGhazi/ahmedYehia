import { useI18n } from "../i18n/context";
import { Eyebrow, Rule } from "../components/primitives";
import { ProjectIndex } from "../components/ProjectIndex";
import { WorkQuickView } from "../components/WorkQuickView";

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

        <WorkQuickView items={projects} />
      </section>
    </>
  );
}
