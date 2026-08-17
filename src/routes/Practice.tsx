import { media } from "../data/media";
import { useI18n } from "../i18n/context";
import { Eyebrow, Reveal, Rule, Shot } from "../components/primitives";

export default function Practice() {
  const { t, profile } = useI18n();
  const portrait = media.portrait[0];
  const wide = media["about-wide"][0];
  const off = media["ahmed-off"][0];

  return (
    <>
      <section className="section section--tight wrap page-top">
        <div className="split" style={{ alignItems: "end" }}>
          <div>
            <Eyebrow>{t.practice.eyebrow}</Eyebrow>
            <h1 className="display" style={{ fontSize: "clamp(2.1rem, 5.2vw, 4.4rem)" }}>
              {t.practice.headline[0]}
              <br />
              {t.practice.headline[1]}
            </h1>
          </div>
          <p className="lede">{profile.intro}</p>
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="split">
          <Reveal className="marks">
            <Shot image={portrait} alt={t.practice.portraitAlt} ratio="4 / 5" />
          </Reveal>

          <Reveal mode="rise" delay={90}>
            <div className="prose">
              {profile.profileText.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <div className="cols-2" style={{ marginTop: "clamp(26px, 3vw, 40px)", gap: "clamp(20px, 3vw, 40px)" }}>
              {profile.competencies.map((group) => (
                <div key={group.id}>
                  <p className="label">{group.title}</p>
                  <ul className="list-plain list-rule">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------- experience -- */}
      <section className="section wrap">
        <Eyebrow>{t.practice.experience(profile.experience.length)}</Eyebrow>

        <div className="ledger">
          {profile.experience.map((job) => (
            <Reveal mode="rise" className="ledger__item" key={`${job.org}-${job.from}`}>
              <p className="ledger__when">
                {job.current && <span className="ledger__dot" aria-hidden="true" />}
                {job.from} — {job.to}
              </p>
              <div>
                <h2 className="ledger__title">{job.title}</h2>
                <p className="ledger__org">
                  {job.org} · {job.place}
                </p>
                <ul className="ledger__lines">
                  {job.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {job.projects.length > 0 && (
                  <div className="tags">
                    {job.projects.map((p) => (
                      <span className="tag" key={p}>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ interlude -- */}
      <section className="wrap" style={{ paddingBottom: "clamp(56px, 8vw, 110px)" }}>
        <Reveal>
          <figure style={{ margin: 0 }}>
            <span className="frame" style={{ aspectRatio: "21 / 9" }}>
              <img src={wide.src} width={wide.w} height={wide.h} alt={t.practice.interludeCaption} loading="lazy" />
            </span>
            <figcaption className="figcap">
              <b>{t.practice.interludeLabel}</b>
              {t.practice.interludeCaption}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ------------------------------------------------ education & kit -- */}
      <section className="section wrap">
        <Rule soft />
        <div style={{ height: "clamp(28px, 4vw, 48px)" }} />

        <div className="cols-2">
          <Reveal mode="rise">
            <Eyebrow>{t.practice.education}</Eyebrow>
            {profile.education.map((edu) => (
              <div key={edu.title} style={{ marginBottom: 26 }}>
                <h2 className="ledger__title">{edu.title}</h2>
                <p className="ledger__org" style={{ marginBottom: 10 }}>
                  {edu.org} · {edu.year}
                </p>
                <ul className="ledger__lines">
                  {edu.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="label" style={{ margin: "30px 0 12px" }}>
              {t.practice.certificates}
            </p>
            <div className="tags" style={{ marginTop: 0 }}>
              {profile.certificates.map((c) => (
                <span className="tag" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal mode="rise" delay={90}>
            <Eyebrow>{t.practice.softwareHand}</Eyebrow>
            <ul className="list-plain list-rule">
              {profile.software.map((s) => (
                <li key={s.name}>
                  {s.name}
                  <span className="meter" aria-label={t.practice.outOf(s.level)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} data-on={n <= s.level} />
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <p className="label" style={{ margin: "30px 0 12px" }}>
              {t.practice.languages}
            </p>
            <ul className="list-plain list-rule">
              {profile.languages.map((l) => (
                <li key={l.name}>
                  {l.name}
                  <span>{l.level}</span>
                </li>
              ))}
            </ul>

            <p className="label" style={{ margin: "30px 0 12px" }}>
              {t.practice.awayFromSite}
            </p>
            <span className="frame" style={{ aspectRatio: "16 / 10", marginBottom: 16 }}>
              <img src={off.src} width={off.w} height={off.h} alt={t.practice.ridingAlt} loading="lazy" />
            </span>
            <ul className="ledger__lines">
              {profile.aside.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
