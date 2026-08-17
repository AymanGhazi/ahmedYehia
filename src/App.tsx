import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Chrome";
import { useSmoothScroll } from "./lib/hooks";
import { useI18n } from "./i18n/context";
import Home from "./routes/Home";
import Work from "./routes/Work";
import Project from "./routes/Project";
import Practice from "./routes/Practice";
import Contact from "./routes/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
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
      <ScrollToTop />
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
