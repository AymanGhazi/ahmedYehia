export type ProjectText = {
  title: string;
  subtitle: string;
  client: string;
  location: string;
  studio: string;
  role: string;
  scope: string[];
  materials: string[];
  summary: string;
  notes: string[];
  pull?: { text: string; source: string };
  compareCaption?: string;
  captions?: Record<number, string>;
};

export const projectsEn: Record<string, ProjectText> = {
  "sodic-east": {
    title: "SODIC East",
    subtitle: "Premium unit finishing, New Cairo",
    client: "Private client",
    location: "SODIC East, New Cairo — adjacent to AUC",
    studio: "Painite Architects",
    role: "Senior Architect — material selection and execution follow-up",
    scope: [
      "Full apartment finishing package",
      "Wall and ceiling treatment",
      "Kitchen and joinery installation",
      "Sanitary and lighting fit-out",
    ],
    materials: [
      "Romano decorative paint",
      "Gotashield paint",
      "Frameless recessed spots",
      "Black metal joinery",
      "Porcelain and marble",
    ],
    summary:
      "A premium unit taken through its full finishing package. The specification moved away from the usual emulsion-and-trim approach: Romano and Gotashield finishes throughout the apartment and inside the bathrooms, and frameless spots so the ceiling reads as one clean plane with no visible fittings.",
    notes: [
      "Every new material was sampled and mocked up on site before the specification was approved.",
      "Frameless spots require the gypsum layout to be set out before the boards close — the coordination happens weeks before the light goes in.",
    ],
    captions: {
      1: "Vanity and mirror, complete",
      2: "Kitchen island set out and levelled",
      7: "Romano finish, applied and cured",
      8: "Application in progress — the coat that decides the wall",
    },
  },

  "reception-master-suite": {
    title: "Reception & Master Suite",
    subtitle: "Full apartment design and visualisation",
    client: "Private client",
    location: "Cairo, Egypt",
    studio: "Creativity Design",
    role: "Project Manager — design, visualisation and delivery",
    scope: [
      "Proposed floor plan",
      "Reception and dining",
      "Master suite and dressing",
      "Bathrooms, guest room, kid's room",
      "Lighting distribution and ceiling design",
    ],
    materials: [
      "Marble dining top",
      "Fluted glass and brass screens",
      "Gypsum board ceilings",
      "Concealed curtain housing",
      "Track and spot lighting",
    ],
    summary:
      "A complete apartment designed room by room, from the proposed plan through to the lighting layout. The reception carries the dining area, a library wall with the television, the living sofa and the chandelier positions; the master suite resolves dressing, make-up table, bed-head wall and bathroom against a single ceiling design.",
    notes: [
      "Curtain housing, lighting housing, spots and chandelier were all set out on the same reflected ceiling plan.",
      "Cutaway plan views were rendered so the client could read circulation and furniture before committing.",
    ],
    captions: {
      1: "Reception, looking through to the living area",
      8: "Master suite — cutaway plan view",
      9: "Bed-head wall and dressing, cutaway",
      10: "Whole-apartment massing study",
    },
  },

  "classic-villa": {
    title: "Stair Hall & Living",
    subtitle: "Classic residence — design against as built",
    client: "Private client",
    location: "Cairo, Egypt",
    studio: "Creativity Design",
    role: "Project Manager — design, joinery and site delivery",
    scope: [
      "Stair hall and wrought-iron balustrade",
      "Timber room divider and television unit",
      "Classic cornice, columns and arches",
      "Gypsum ceilings and lighting",
      "Wall panelling and wallpaper",
    ],
    materials: [
      "Wrought iron balustrade",
      "Walnut joinery",
      "Rosso marble treads",
      "Gypsum cornice and columns",
      "Textured wallpaper",
    ],
    summary:
      "A classic interior where the joinery does the structural work: a timber shelving unit divides living from stair hall without closing either off, and the wrought-iron balustrade carries up through the full height of the house. The unit was rendered first, then built — the two are shown side by side below.",
    notes: [
      "The divider was drawn, fabricated in the workshop and adjusted twice on site before the shelves were fixed.",
      "Cornice, arch springing and column positions were set out from the same datum so the classical detail stayed consistent floor to floor.",
    ],
    compareCaption: "Timber divider and television unit — render against the finished room",
    captions: {
      1: "Entrance hall, columns and console",
      2: "Stair and wrought-iron balustrade",
      5: "As built — the same unit, on site",
      6: "Design — divider, fireplace and television wall",
      7: "As built, seen from the stair hall",
      19: "Design versus reality, as presented to the client",
    },
  },

  "lakeview-b96": {
    title: "Lakeview Penthouse B96",
    subtitle: "Full finishing package and roof level",
    client: "MHD Group",
    location: "Lake View Residence, Giza",
    studio: "MHD Group",
    role: "Site supervision & execution engineer",
    scope: [
      "Living, master suite and bedrooms",
      "Wood cladding to television wall",
      "Marble works throughout",
      "Outdoor roof area and service bar",
      "Swimming pool and terrace",
    ],
    materials: [
      "Doubleblack marble",
      "Oreogray marble",
      "Terrista marble",
      "Pietra marble",
      "Arabica marble block sink",
      "Walnut doors with black metal",
      "Pool mosaics",
      "PVC decking",
    ],
    summary:
      "The second of two Lake View penthouses. Wood cladding to the living-room television wall, walnut doors framed in black metal across every bedroom, and an Arabica marble block sink cut for the guest bathroom. The roof level carries a service bar in three marbles and a mosaic-lined pool.",
    notes: [
      "Three marbles run through the roof bar — Doubleblack, Oreogray and Terrista — each with its own edge detail.",
      "Modern, sleek and monochromatic, brought back up with touches of colour: the brief for the whole roof level.",
    ],
    captions: {
      10: "Design versus reality — the roof bar",
      11: "Design versus reality — wall finish",
      12: "Design versus reality — door detail and drawing",
      13: "Design versus reality — marble basin",
      16: "Roof pool and planting, complete",
      21: "Issued-for-construction plan",
    },
  },

  "lakeview-b16": {
    title: "Lakeview Penthouse B16",
    subtitle: "Third floor and roof, foundation to handover",
    client: "MHD Group",
    location: "Lake View Residence, Giza",
    studio: "MHD Group",
    role: "Site supervision & execution engineer",
    scope: [
      "Reception, dressing room and master suite",
      "FUTEC cladding to walls and doors",
      "Roof floor — kitchenette, laundry, lobby, guest bathroom",
      "Outdoor roof area and bar",
      "Swimming pool, built from scratch",
    ],
    materials: [
      "FUTEC panels",
      "Parquet flooring",
      "Wallpaper",
      "Quartz worktops",
      "Grohe fittings",
      "Duravit sanitaryware",
      "Corian tops",
      "Pool mosaics",
    ],
    summary:
      "A full third-floor and roof finishing package. FUTEC was installed across every wall and door face, the reception took parquet, wallpaper and a new handrail, and the roof gained an outdoor bar in quartz with its own lighting layout. The pool was built on the roof from sizing through isolation, structure, mosaic and testing.",
    notes: [
      "Pool sequence: sizing up, isolation, building, mosaic, then a full water test before handover.",
      "Bathrooms specified on Grohe, Duravit, Corian tops and lit mirrors.",
    ],
    pull: {
      text: "Every finishing item, to full detail level.",
      source: "Scope of works, Lake View Residence",
    },
    captions: {
      1: "Reception before finishing — parquet down, walls prepared",
      16: "Roof pool, complete",
      17: "Isolation stage",
      18: "Setting out and sizing up",
      20: "Mosaic stage",
      23: "FUTEC installation to walls and doors",
      29: "Furniture layout with upstand walls — ground floor",
    },
  },

  "dark-statement": {
    title: "Dark Statement",
    subtitle: "Bathrooms, television units and detail work",
    client: "Private clients",
    location: "Cairo, Egypt",
    studio: "Creativity Design",
    role: "Project Manager — design and execution",
    scope: [
      "Dark marble and mosaic bathrooms",
      "Bespoke television units",
      "Shower enclosures and accessories",
      "Cornice, column and ceiling detail",
    ],
    materials: [
      "Black marble",
      "Glass mosaic",
      "Brushed brass fittings",
      "Rose gold accessories",
      "Backlit round mirrors",
    ],
    summary:
      "A set of rooms built around dark tone and sharp line. The bathrooms use black marble against glass mosaic, with brass fittings and a backlit round mirror doing the lighting work. The television units were drawn and executed to balance the look against how the room is actually used.",
    notes: [
      "Bathroom accessories were selected first — their shape sets the tone of the room before anything else goes in.",
      "The television unit was detailed for cable routes, ventilation and viewing height, then finished to match the joinery.",
    ],
    pull: {
      text: "Black isn't just a colour. It's a statement. Luxury lives in the details — dark tones, sharp lines.",
      source: "Ahmed Yahia, project notes",
    },
    captions: {
      1: "Design — dark marble and mosaic bathroom",
      3: "As built",
      10: "Brass fittings against black marble",
    },
  },

  "sama-tower": {
    title: "Sama Tower, Maadi",
    subtitle: "Complete finishing and bespoke furniture",
    client: "Private client based in Saudi Arabia",
    location: "Sama Tower, Maadi",
    studio: "Creativity Design",
    role: "Project Manager — full delivery and handover",
    scope: [
      "All finishing items",
      "Kitchen and breakfast bar",
      "Four bedrooms, furnished",
      "Bathrooms in dark marble",
      "Furniture manufacture and installation",
      "Handover to overseas client",
    ],
    materials: [
      "Dark veined marble",
      "Timber wardrobes and headboards",
      "Ring and linear pendant lighting",
      "Porcelain flooring",
    ],
    summary:
      "A residential apartment delivered end to end for a client abroad. Every finishing item was executed on site, the furniture was manufactured to drawing rather than bought in, and the unit was handed over complete to an owner in Saudi Arabia who followed the whole programme remotely.",
    notes: [
      "Remote client: progress was reported continuously in photographs, with sign-off at each stage.",
      "Bedrooms were furnished to a single joinery language so the wardrobes, headboards and bedside units read as one.",
    ],
    captions: {
      1: "Kitchen and breakfast bar, complete",
      9: "Guest bathroom in dark veined marble",
    },
  },

  "porcelain-precision": {
    title: "Porcelain Precision",
    subtitle: "Setting out, alignment and tolerance",
    client: "Internal study",
    location: "Cairo, Egypt",
    studio: "Painite Architects",
    role: "Senior Architect — quality control",
    scope: ["Setting out and levelling", "Joint alignment", "Book-matched wall panels", "Tolerance checking"],
    materials: ["Large-format porcelain", "Book-matched marble-effect slabs", "Levelling clips"],
    summary:
      "A close look at the one thing that separates a good porcelain finish from a perfect one: setting out. Slab positions are marked, levelling clips are set, and joints are aligned across floor and wall before a single tile is bedded permanently.",
    notes: ["Alignment is not an option, it's a standard."],
    pull: {
      text: "When it comes to porcelain, precision is what turns a good finish into a perfect one.",
      source: "Ahmed Yahia, project notes",
    },
    captions: {
      1: "Wall slabs marked out before fixing",
      3: "Checking alignment across the joint",
    },
  },

  "manual-design": {
    title: "Hand Drawing",
    subtitle: "Sketching, site analysis and presentation",
    client: "Academic and personal work",
    location: "Egypt",
    studio: "Modern Academy / personal",
    role: "Draughtsman and student",
    scope: ["Manual perspective and elevation", "Site analysis sheets", "Presentation boards", "AutoCAD documentation"],
    materials: ["Graphite and ink on paper", "AutoCAD 2D", "Photoshop"],
    summary:
      "Where the eye was trained. Hand perspectives, elevation studies and analysis sheets drawn before any of it went into a computer — still the fastest way to test whether a detail works before it costs anything to find out.",
    notes: [
      "The Egyptian Parliament study covered site analysis, massing and full 2D documentation.",
      "Drawing by hand is still part of how a site problem gets resolved in front of a client.",
    ],
    captions: {
      4: "Visual sketch board",
      5: "Studio, Modern Academy",
      7: "Egyptian Parliament — site analysis sheet",
      8: "Egyptian Parliament — plan documentation",
    },
  },
};
