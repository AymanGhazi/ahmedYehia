import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { media } from "../data/media";
import { useI18n, imageAt } from "../i18n/context";
import { Eyebrow, Reveal, Rule, Shot } from "../components/primitives";
import { Comparator } from "../components/Comparator";
import { WorkQuickView } from "../components/WorkQuickView";

export default function Home() {
  const { t, profile, projects, totalImages, bySlug } = useI18n();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 90);
    return () => clearTimeout(id);
  }, []);

  const villa = bySlug("classic-villa")!;
  const hero = media.hero[0];
  const portrait = media.ahmed[0];

  /* Served from /public, so the href is the path and `download` names the file
     the visitor ends up with — the source names carry spaces. */
  const docs = [
    {
      href: "/docs/ahmed-yehia-portfolio.pdf",
      file: "Ahmed Yehia — Portfolio.pdf",
      label: t.hero.downloadPortfolio,
      mb: 5.5,
      solid: true,
    },
    {
      href: "/docs/ahmed-yehia-cv.pdf",
      file: "Ahmed Yehia — CV.pdf",
      label: t.hero.downloadCv,
      mb: 1.0,
      solid: false,
    },
  ];

  return (
    <>
      {/* ------------------------------------------------------------ cover */}
      <section className="hero" data-ready={ready}>
        <div className="hero__left">
          <p className="hero__year">{t.hero.year}</p>

          <div className="hero__mid">
            <h1 className="display hero__big">
              <span className="ln">
                <span>{t.hero.big}</span>
              </span>
            </h1>
            <p className="hero__sub">{t.hero.sub}</p>

            {/* The deck and the CV, before anything has to be scrolled for. */}
            <div className="hero__get">
              {docs.map((doc) => (
                <a
                  className={`btn btn--get${doc.solid ? " btn--solid" : ""}`}
                  key={doc.href}
                  href={doc.href}
                  download={doc.file}
                  type="application/pdf"
                >
                  <span className="btn__text">{doc.label}</span>
                  <span className="btn__meta" dir="ltr">
                    {t.hero.pdfHint(doc.mb)}
                  </span>
                  <span className="arrow arrow--down" aria-hidden="true">
                    ↓
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="hero__foot">
            <p className="hero__sign">
              {profile.name}
              <span>{t.hero.signRole}</span>
            </p>
            <p className="hero__facts">
              {t.hero.facts.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </p>
          </div>
        </div>

        <div className="hero__right">
          <img src={hero.src} width={hero.w} height={hero.h} alt={t.hero.caption.project} fetchPriority="high" />
          <div className="hero__caption">
            <span>{t.hero.caption.project}</span>
            <span>{t.hero.caption.stage}</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- statement */}
      <section className="section wrap">
        <div className="split">
          <Reveal mode="rise">
            <Shot image={portrait} alt={profile.name} ratio="1 / 1" />
          </Reveal>

          <div className="stack">
            <Reveal mode="rise" delay={70}>
              <p className="lede">{profile.intro}</p>
            </Reveal>

            <Reveal mode="rise" delay={130}>
              <div className="prose">
                <p>{profile.profileText[1]}</p>
                <p>{profile.profileText[2]}</p>
              </div>
            </Reveal>

            <Reveal mode="rise" delay={190}>
              <div>
                <p className="label">{t.home.deliveredFor}</p>
                <div className="tags" style={{ marginTop: 0 }}>
                  {profile.developers.map((d) => (
                    <span className="tag" key={d}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- availability */}
      <section className="section section--tight wrap">
        <Rule />
        <div style={{ height: "clamp(30px, 4vw, 54px)" }} />

        <Reveal mode="rise">
          <div className="availability">
            <div>
              <Eyebrow>{t.home.availability}</Eyebrow>
              <h2 className="display display--mid availability__head">{profile.availability.headline}</h2>
            </div>
            <div>
              <p className="prose" style={{ marginBottom: 22 }}>
                {profile.availability.body}
              </p>
              <ul className="list-plain list-rule">
                {profile.availability.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------- design vs built */}
      <section className="section wrap" id="design-reality">
        <div className="split" style={{ alignItems: "end", marginBottom: "clamp(26px, 4vw, 48px)" }}>
          <div>
            <Eyebrow>{t.home.test}</Eyebrow>
            <h2
              className="display display--mid"
              style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.9rem)", whiteSpace: "pre-line" }}
            >
              {t.home.testHeadline}
            </h2>
          </div>
          <p className="prose" style={{ maxWidth: "50ch" }}>
            {t.home.testBody}
          </p>
        </div>

        <Reveal>
          <Comparator
            design={imageAt(villa, villa.compare!.design)}
            built={imageAt(villa, villa.compare!.built)}
            caption={villa.compareCaption}
          />
        </Reveal>
      </section>

      {/* --------------------------------------------------------------- work */}
      <section className="section wrap" id="work">
        <div className="split" style={{ alignItems: "end", marginBottom: "clamp(26px, 4vw, 44px)" }}>
          <div>
            <Eyebrow>{t.work.eyebrow}</Eyebrow>
            <h2 className="display display--mid" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.9rem)" }}>
              {t.home.selectedWork}
            </h2>
          </div>
          <p className="prose" style={{ maxWidth: "46ch" }}>
            {t.work.blurb(projects.length, totalImages)}
          </p>
        </div>

        <WorkQuickView items={projects} />

        <p style={{ marginTop: "clamp(36px, 4.5vw, 60px)" }}>
          <Link className="btn" to="/work">
            {t.home.fullIndex}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------ capabilities */}
      <section className="section wrap">
        <Rule soft />
        <div style={{ height: "clamp(30px, 4vw, 52px)" }} />
        <Eyebrow>{t.home.dayConsists}</Eyebrow>

        <div className="cols-4">
          {profile.competencies.map((group, i) => (
            <Reveal mode="rise" key={group.id} delay={i * 70}>
              <bdi className="numeral" style={{ fontSize: "2.4rem", marginBottom: 16 }} dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </bdi>
              <h3 className="card__title" style={{ marginBottom: 16 }}>
                {group.title}
              </h3>
              <ul className="list-plain list-rule">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
