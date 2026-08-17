import { NavLink, Link, useLocation } from "react-router-dom";
import { Monogram } from "./primitives";
import { useHideOnScroll } from "../lib/hooks";
import { isWhatsApp, phoneLinkProps } from "../lib/contact";
import { useI18n } from "../i18n/context";

export function Header() {
  const hidden = useHideOnScroll();
  const { pathname } = useLocation();
  const { t, profile, toggle, lang } = useI18n();
  const onWork = pathname === "/" || pathname.startsWith("/work");

  return (
    <header className="header" data-hidden={hidden}>
      <div className="wrap header__in">
        <Link to="/" className="brand" aria-label={profile.name}>
          <Monogram className="brand__mark" />
          <span className="brand__text">
            {profile.shortName}
            <span>{t.brandRole}</span>
          </span>
        </Link>

        <div className="header__right">
          <nav className="nav" aria-label={t.nav.work}>
            {/* The work sits on the front page — the tab jumps to it, no load. */}
            <Link to="/#work" aria-current={onWork ? "page" : undefined}>
              {t.nav.work}
            </Link>
            <NavLink to="/practice">{t.nav.practice}</NavLink>
            <NavLink to="/contact" className="nav__cta">
              {t.nav.contact}
            </NavLink>
          </nav>

          <button
            type="button"
            className="langswitch"
            onClick={toggle}
            lang={lang === "en" ? "ar" : "en"}
            aria-label={t.switchLabel}
          >
            {t.switchTo}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t, profile, projects, totalImages } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <h2 className="footer__big">
              {t.footer.cta[0]}
              <br />
              {t.footer.cta[1]}
            </h2>
            <a className="btn" href={`mailto:${profile.email}`} dir="ltr">
              {profile.email}
            </a>
          </div>

          <div>
            <p className="label">{t.footer.direct}</p>
            <ul className="footer__list list-plain">
              {profile.phones.map((phone) => (
                <li key={phone}>
                  <a className="link" {...phoneLinkProps(phone, profile.whatsapp)} dir="ltr">
                    {phone}
                  </a>
                  {isWhatsApp(phone, profile.whatsapp) && (
                    <span className="tag-wa">{t.contact.whatsapp}</span>
                  )}
                </li>
              ))}
              <li>
                <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
                  {t.contact.linkedin}
                </a>
              </li>
              <li style={{ color: "var(--ink-3)" }}>{profile.addressLine}</li>
            </ul>
          </div>

          <div>
            <p className="label">{t.footer.index}</p>
            <ul className="footer__list list-plain">
              <li>
                <Link className="link" to="/work">
                  {t.footer.workCount(projects.length)}
                </Link>
              </li>
              <li>
                <Link className="link" to="/practice">
                  {t.footer.practice}
                </Link>
              </li>
              <li>
                <Link className="link" to="/contact">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>{t.footer.since(2018)}</span>
          <span>{t.footer.imageCount(totalImages)}</span>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
