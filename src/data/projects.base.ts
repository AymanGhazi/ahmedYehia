import { media, type Media } from "./media";
import { swatchFor } from "../lib/swatch";

/**
 * Everything about a project that does not change with language: which images
 * belong to it, which one leads, and the material palette. Material names are
 * kept here in English purely to resolve swatch colours — the labels a reader
 * sees come from the localised text files, index-aligned with this list.
 */
export type ProjectBase = {
  slug: string;
  ref: string;
  years: string;
  heroIndex: number;
  cardIndex: number;
  featured: boolean;
  /** 1-based indices into the project's image list. */
  compare?: { design: number; built: number };
  materialKeys: string[];
  images: Media[];
  swatches: string[];
};

const base = (
  b: Omit<ProjectBase, "images" | "swatches">,
): ProjectBase => ({
  ...b,
  images: media[b.slug as keyof typeof media] as Media[],
  swatches: b.materialKeys.map(swatchFor),
});

export const projectsBase: ProjectBase[] = [
  base({
    slug: "sodic-east",
    ref: "PA-01",
    years: "2026",
    heroIndex: 2,
    cardIndex: 1,
    featured: true,
    materialKeys: [
      "Romano decorative paint",
      "Gotashield paint",
      "Frameless recessed spots",
      "Black metal joinery",
      "Porcelain and marble",
    ],
  }),
  base({
    slug: "reception-master-suite",
    ref: "CD-04",
    years: "2023–25",
    heroIndex: 1,
    cardIndex: 1,
    featured: true,
    materialKeys: [
      "Marble dining top",
      "Fluted glass and brass screens",
      "Gypsum board ceilings",
      "Concealed curtain housing",
      "Track and spot lighting",
    ],
  }),
  base({
    slug: "classic-villa",
    ref: "CD-02",
    years: "2023–25",
    heroIndex: 1,
    cardIndex: 1,
    featured: true,
    compare: { design: 6, built: 7 },
    materialKeys: [
      "Wrought iron balustrade",
      "Walnut joinery",
      "Rosso marble treads",
      "Gypsum cornice and columns",
      "Textured wallpaper",
    ],
  }),
  base({
    slug: "lakeview-b96",
    ref: "MHD-96",
    years: "2022–23",
    heroIndex: 16,
    cardIndex: 16,
    featured: true,
    materialKeys: [
      "Doubleblack marble",
      "Oreogray marble",
      "Terrista marble",
      "Pietra marble",
      "Arabica marble block sink",
      "Walnut doors with black metal",
      "Pool mosaics",
      "PVC decking",
    ],
  }),
  base({
    slug: "lakeview-b16",
    ref: "MHD-16",
    years: "2022–23",
    heroIndex: 16,
    cardIndex: 16,
    featured: false,
    materialKeys: [
      "FUTEC panels",
      "Parquet flooring",
      "Wallpaper",
      "Quartz worktops",
      "Grohe fittings",
      "Duravit sanitaryware",
      "Corian tops",
      "Pool mosaics",
    ],
  }),
  base({
    slug: "dark-statement",
    ref: "CD-07",
    years: "2023–25",
    heroIndex: 1,
    cardIndex: 1,
    featured: false,
    materialKeys: [
      "Black marble",
      "Glass mosaic",
      "Brushed brass fittings",
      "Rose gold accessories",
      "Backlit round mirrors",
    ],
  }),
  base({
    slug: "sama-tower",
    ref: "CD-09",
    years: "2023–25",
    heroIndex: 1,
    cardIndex: 1,
    featured: false,
    materialKeys: [
      "Dark veined marble",
      "Timber wardrobes and headboards",
      "Ring and linear pendant lighting",
      "Porcelain flooring",
    ],
  }),
  base({
    slug: "porcelain-precision",
    ref: "PA-06",
    years: "2026",
    heroIndex: 1,
    cardIndex: 1,
    featured: false,
    materialKeys: ["Large-format porcelain", "Book-matched marble-effect slabs", "Levelling clips"],
  }),
  base({
    slug: "manual-design",
    ref: "ED-00",
    years: "2015–19",
    heroIndex: 1,
    cardIndex: 1,
    featured: false,
    materialKeys: ["Graphite and ink on paper", "AutoCAD 2D", "Photoshop"],
  }),
];

export const totalImages = projectsBase.reduce((n, x) => n + x.images.length, 0);
