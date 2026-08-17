import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Chrome";
import { reducedMotion, useSmoothScroll } from "./lib/hooks";
import { useI18n } from "./i18n/context";
import Home from "./routes/Home";
import Work from "./routes/Work";
import Project from "./routes/Project";
import Practice from "./routes/Practice";
import Contact from "./routes/Contact";

/**
 * A new page starts at the top; a link carrying a hash goes to that section
 * instead — the header floats over the content, so the target is offset clear
 * of it. Keyed on the navigation, so tapping the same tab twice still moves.
 */
function ScrollToTarget() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (!target) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: reducedMotion() ? ("instant" as ScrollBehavior) : "smooth" });
  }, [pathname, hash, key]);

  return null;
}

function DocumentTitle() {
  const { pathname } = useLocation();
  const { t, profile } = useI18n();

  useEffect(() => {
    const key = pathname === "/" ? "home" : (pathname.split("/")[1] as keyof typeof t.htmlTitle);
    document.title = t.htmlTitle[key] ?? `${profile.name} — ${profile.role}`;
  }, [pathname, t, profile]);

  return null;
}

export default function App() {
  useSmoothScroll();

  return (
    <>
      <ScrollToTarget />
      <DocumentTitle />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
