import { media } from "../data/media";
import { useI18n } from "../i18n/context";
import { isWhatsApp, phoneLinkProps } from "../lib/contact";
import { Eyebrow, Reveal, Rule } from "../components/primitives";

export default function Contact() {
  const { t, profile } = useI18n();
  const shot = media.ahmed[0];

  return (
    <>
      <section className="section section--tight wrap page-top">
        <Eyebrow>{t.contact.eyebrow}</Eyebrow>
        <h1 className="display" style={{ fontSize: "clamp(2.1rem, 6.2vw, 5rem)", maxWidth: "16ch" }}>
          {t.contact.headline[0]}
          <br />
          {t.contact.headline[1]}
        </h1>
        <p className="lede" style={{ marginTop: "clamp(22px, 3vw, 34px)" }}>
          {t.contact.blurb}
        </p>
      </section>

      <section className="section section--tight wrap">
        <div className="split">
          <Reveal mode="rise">
            <dl className="spec spec--contact">
              <dt>{t.contact.email}</dt>
              <dd>
                <a className="link" href={`mailto:${profile.email}`} dir="ltr">
                  {profile.email}
                </a>
              </dd>

              <dt>{t.contact.phone}</dt>
              <dd>
                {profile.phones.map((phone) => (
                  <span key={phone} className="phone-line">
                    <a className="link" {...phoneLinkProps(phone, profile.whatsapp)} dir="ltr">
                      {phone}
                    </a>
                    {isWhatsApp(phone, profile.whatsapp) && <span className="tag-wa">{t.contact.whatsapp}</span>}
                  </span>
                ))}
              </dd>

              <dt>{t.contact.linkedin}</dt>
              <dd>
                <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer" dir="ltr">
                  {profile.linkedinLabel}
                </a>
              </dd>

              <dt>{t.contact.based}</dt>
              <dd>{profile.addressLine}</dd>

              <dt>{t.contact.languages}</dt>
              <dd>{profile.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</dd>
            </dl>

            <div className="tags" style={{ marginTop: 22 }}>
              {profile.availability.points.map((point) => (
                <span className="tag tag--solid" key={point}>
                  {point}
                </span>
              ))}
            </div>

            <p style={{ marginTop: "clamp(26px, 3vw, 40px)" }}>
              <a className="btn" href={`mailto:${profile.email}`}>
                {t.contact.startEmail}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </p>
          </Reveal>

          <Reveal delay={80} className="marks">
            <span className="frame" style={{ aspectRatio: "4 / 5" }}>
              <img src={shot.src} width={shot.w} height={shot.h} alt={profile.name} loading="lazy" />
            </span>
          </Reveal>
        </div>
      </section>

      <section className="section wrap">
        <Rule soft />
        <div style={{ height: "clamp(28px, 4vw, 48px)" }} />
        <Eyebrow>{t.contact.howItRuns}</Eyebrow>

        <div className="ledger">
          {t.contact.stages.map((stage, i) => (
            <Reveal mode="rise" className="ledger__item" key={stage.label} delay={i * 70}>
              <p className="ledger__when">{stage.label}</p>
              <p className="prose" style={{ margin: 0 }}>
                {stage.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
