/**
 * Every project lists the materials it was actually specified in. This maps a
 * material name to the colour it reads as on site, so each project carries a
 * palette strip alongside its images.
 */
const table: [RegExp, string][] = [
  [/doubleblack|black marble/i, "#211f1e"],
  [/black metal|black steel/i, "#0f0f11"],
  [/oreogray|oreo/i, "#6f6d6a"],
  [/terrista|terriesta/i, "#8b8175"],
  [/pietra|peatra/i, "#a09889"],
  [/arabica/i, "#cbc2b2"],
  [/rosso|red marble/i, "#7d4a41"],
  [/marble|slab/i, "#b9b3a8"],
  [/walnut/i, "#4c3627"],
  [/timber|wood|parquet|hdf|joinery|headboard|wardrobe/i, "#7b5b3c"],
  [/brass|gold/i, "#9d7c40"],
  [/mosaic|pool/i, "#1d6f72"],
  [/porcelain|corian|quartz/i, "#ddd8d0"],
  [/gypsum|cornice|plaster/i, "#e2ded7"],
  [/romano|gotashield|paint|limewash/i, "#cdc6b9"],
  [/futec/i, "#c8c1b5"],
  [/glass|mirror|fluted/i, "#8ba0a6"],
  [/pvc|clip|levelling/i, "#54524e"],
  [/light|spot|pendant|lamp/i, "#efdfb4"],
  [/wallpaper|fabric|textur/i, "#b4a993"],
  [/grohe|duravit|sanitary|fitting|accessor/i, "#9aa0a2"],
  [/graphite|ink|autocad|photoshop/i, "#3b3a38"],
];

export const swatchFor = (material: string): string => {
  for (const [pattern, colour] of table) if (pattern.test(material)) return colour;
  return "#6a655e";
};
