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

## The work on the front page

Every project sits on the landing page, in `#work`, in the order of the source
PowerPoint — hand drawing, Lake View B:16 and B:96, the Creativity Design
apartments, then the two Painite units. The `Work` tab in the header jumps to
that section rather than loading a page; `projectsBase` in
`src/data/projects.base.ts` is what holds the order.

Each card slides through its own photographs where it stands. Drag or swipe the
frame sideways, use the arrow keys once it has focus, or pick a tick off the rule
under it — the rule is the read-out as well as the control, one tick per
photograph with the one on screen lit, drawn like the dimension rules elsewhere on
the site and spanning the frame whether the project runs to three photographs or
thirty-three. The counter in the card meta says the same thing in figures. Nothing
moves on its own: the card holds whatever frame it was left on.

Sliding is deliberately cheap. The cover is the full-size image, everything slid
to after it is the small copy the frame is sized for anyway, and only the frames
either side of the current one are prefetched — and only once a card has been
touched, so the landing page still asks for nine images.

Clicking the photograph opens whatever frame is up as a quick look over the page.
It takes arrow keys, a swipe, the edges of the frame, or the thumbnail rail along
the bottom, and closes on escape or a click on the ground around the photograph.
The next and previous frames are fetched while the current one is on screen, so a
flip does not wait on the network. `Full project` in the bar is the way through to
the project sheet for a reader who wants the specification, and so is the
reference code under each card.

A drag is not a click: passing 40px sideways slides the set and swallows the
click that follows, so the quick look never opens behind a swipe.

The project page gallery is the same mechanism at full width — one frame slid
through instead of a wall of thumbnails, with the tick rule and the caption under
it. It shows the whole photograph rather than cropping to a shape, so a landscape
room and a portrait detail sit in the same frame on the ground the deck put them
on, and it takes the full-size copies throughout rather than the small ones.
Opening a frame full size and closing it again leaves the gallery on whichever
photograph the reader got to.

`components/Slides.tsx` holds all of it once: `useSlides` for the mechanics,
`SlideLayers` for the two animated layers inside a frame, `SlideRule` for the
ticks. The cards and the gallery differ only in what they wrap it in.

`/work` is still the full index — the disclosure rows carrying scope, role and
studio — and every project keeps its own page.

## Structure

```
src/
  routes/       Home, Work, Project, Practice, Contact
  components/   Header/Footer, ProjectIndex, WorkQuickView, Slides, Comparator, Lightbox, primitives
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
arrow-key control, the index rows are proper disclosure buttons, the slide rules
are groups of labelled buttons so a set can be worked through from the keyboard,
the lightbox handles escape and arrow keys, names every thumbnail by its frame
number and takes focus on open so the arrows do not also drive the set behind it
(returning focus to whatever opened it on close), and
everything animated is disabled under `prefers-reduced-motion` — including the
jump to `#work`, which lands instantly rather than gliding.

Scroll reveals use an IntersectionObserver. The clip that hides an element is
applied to its *child*, never to the observed element — `clip-path` zeroes an
element's intersection rectangle, so a self-clipping trigger never fires.
