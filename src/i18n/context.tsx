import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Lang, type UI } from "./strings";
import { profileEn, type Profile } from "../data/profile.en";
import { profileAr } from "../data/profile.ar";
import { projectsBase, totalImages, type ProjectBase } from "../data/projects.base";
import { projectsEn, type ProjectText } from "../data/projects.en";
import { projectsAr } from "../data/projects.ar";
import type { Media } from "../data/media";

export type Project = ProjectBase & ProjectText;

const profiles: Record<Lang, Profile> = { en: profileEn, ar: profileAr };
const texts: Record<Lang, Record<string, ProjectText>> = { en: projectsEn, ar: projectsAr };

const STORAGE_KEY = "ayr.lang";

const initialLang = (): Lang => {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ar") return saved;
  return navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
};

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: UI;
  profile: Profile;
  projects: Project[];
  featured: Project[];
  bySlug: (slug: string) => Project | undefined;
  totalImages: number;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", dictionaries[lang].metaDescription);
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "ar" : "en")), []);

  const value = useMemo<Ctx>(() => {
    const text = texts[lang];
    const projects: Project[] = projectsBase.map((b) => ({ ...b, ...text[b.slug] }));
    return {
      lang,
      dir,
      setLang,
      toggle,
      t: dictionaries[lang],
      profile: profiles[lang],
      projects,
      featured: projects.filter((p) => p.featured),
      bySlug: (slug) => projects.find((p) => p.slug === slug),
      totalImages,
    };
  }, [lang, dir, setLang, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}

/** 1-based lookup into a project's images, clamped. */
export const imageAt = (project: Project, oneBased: number): Media =>
  project.images[Math.min(Math.max(oneBased, 1), project.images.length) - 1];
