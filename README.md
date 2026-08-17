# Ahmed Yahia Rashid — portfolio

Bilingual portfolio site for Ahmed Yahia Rashid, architect working in finishing,
execution and site supervision, and looking for a role abroad. React + Vite +
TypeScript, no UI framework.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # serve the build locally
```

## Positioning

The site reads as available for international work: Egypt is where the built
work is, not where the search stops. Project locations stay factual, but the
framing does not tie him to one city.

- `profile.*.ts → availability` is the block that says it outright — headline,
  paragraph and three points. It has its own section on the home page and its
  points repeat as tags on the contact page.
- The hero signature reads "open to work abroad", and the header tagline is the
  discipline, not a city.
- The Sama Tower project carries the proof: a full apartment delivered to an
  owner in Saudi Arabia who followed the whole programme remotely.

Change any of that in `src/data/profile.en.ts` and `profile.ar.ts` — nothing
about the positioning is hard-coded into a component.

## Languages

English and Arabic, switched from the header. The choice is remembered in
`localStorage` and first-time visitors with an Arabic browser locale land in
Arabic. Switching sets `lang` and `dir` on `<html>`; the whole layout mirrors.

| File | Holds |
| --- | --- |
| `src/i18n/strings.ts` | Every UI string in both languages, typed so a missing translation is a build error |
| `src/i18n/context.tsx` | The provider — exposes `t`, `profile`, `projects`, `lang`, `dir`, `toggle` |
| `src/data/profile.en.ts` / `.ar.ts` | Name, contact, profile text, availability, competencies, experience, education, software, languages |
| `src/data/projects.en.ts` / `.ar.ts` | Per-project title, client, location, scope, materials, summary, notes, captions |
| `src/data/projects.base.ts` | What does not translate: image lists, reference codes, years, hero picks, material palette |
| `src/data/media.ts` | Generated image manifest — paths and intrinsic dimensions. Do not hand-edit |

**Adding a translated string:** add it to the `UI` type in `strings.ts`, then to
both `en` and `ar`. TypeScript will not compile until both exist.

### Notes on the Arabic

- Arabic is a connected script, so tracking is switched off for it. One rule in
  `index.css` does this, and Latin runs opt back in by carrying `dir="ltr"`.
- Reference codes, phone numbers and email stay Latin and are wrapped in `<bdi>`
  so they lay out correctly inside Arabic sentences.
- Counts in Arabic prose use Arabic-Indic digits via the `n()` helper in
  `strings.ts`.
- Type is IBM Plex Sans Arabic, loaded only in its Arabic subset at the four
  weights the design uses.

### Notes on RTL

The layout mirrors through logical properties (`padding-inline`,
`inset-inline-start`, `text-align: end`), so most of it needs no RTL rules at
all. Two things cannot mirror themselves:

- **`clip-path`**, which has no logical form — the scroll reveal gets an RTL pair.
- **The comparator**, which pins itself to `dir="ltr"`. Mirroring it would swap
  which photograph sits on which side, and the pair only reads as one room if
  the render and the built room hold their positions.

## Images

Images live in `public/media/<project-slug>/`, numbered `01.jpg` upward, each
with a smaller `01-t.jpg` used for grids and thumbnails. Portraits and the cover
image sit at the top level of `public/media/`.

To add one:

1. Drop the file into `public/media/<slug>/` following the existing numbering,
   and make a thumbnail alongside it (longest edge ~760px).
2. Add a matching entry to that project's array in `src/data/media.ts`, with the
   real pixel width and height — the site uses them to reserve space so images
   do not shift the page as they load.
3. If it deserves a caption, add it to that project's `captions` map in **both**
   `projects.en.ts` and `projects.ar.ts`, keyed by its 1-based position.

`heroIndex` and `cardIndex` in `projects.base.ts` are 1-based positions into the
same array. Pick a landscape image for `heroIndex`; the project header crops to
3:2.

## Structure

```
src/
  routes/       Home, Work, Project, Practice, Contact
  components/   Header/Footer, ProjectIndex, Comparator, Lightbox, primitives
  i18n/         strings (en + ar), language provider
  data/         profile, projects, media
  lib/          hooks, material swatches, contact links
  index.css     The whole design system — tokens, type, components, breakpoints
```

## Design notes

Dark archviz canvas: near-black ground, light-weight wide-tracked type, imagery
carried edge to edge with generous black gutters. Structural devices come from
the trade rather than decoration:

- **Reference codes** (`MHD-96`, `CD-02`) instead of decorative numbering. They
  encode the studio the work was done under.
- **Material swatches** — every project lists what it was specified in, and
  `lib/swatch.ts` maps each material to the colour it reads as on site. The
  colours resolve from the English `materialKeys` in `projects.base.ts`, so the
  palette is identical in both languages; the labels come from the translation,
  index-aligned. Add a keyword to the table in that file if a new material
  should not fall back to the default grey.
- **Dimension rules** — the ticked hairlines between sections are drawn with
  repeating gradients, sized like a setting-out drawing.
- **Registration marks** — the small corner ticks on featured images come from
  the x/y axes Ahmed draws over his own monogram.

The signature element is the **design-against-as-built comparator**: Ahmed
presents his work as a render and the finished room split down one sheet, so the
split is draggable. A project gets one by adding a `compare` block in
`projects.base.ts` naming the two image positions, and a `compareCaption` in
each translation. It is keyboard operable — arrow keys, shift for larger steps,
home/end.

Colour, spacing and type live entirely in the `:root` block of `index.css`.

## Accessibility

Muted text meets AA against the ground. The comparator is a real `slider` with
arrow-key control, the index rows are proper disclosure buttons, the lightbox
handles escape and arrow keys, and everything animated is disabled under
`prefers-reduced-motion`.

Scroll reveals use an IntersectionObserver. The clip that hides an element is
applied to its *child*, never to the observed element — `clip-path` zeroes an
element's intersection rectangle, so a self-clipping trigger never fires.
