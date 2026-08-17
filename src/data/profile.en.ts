export type Competency = { id: string; title: string; items: string[] };
export type Job = {
  title: string;
  org: string;
  place: string;
  from: string;
  to: string;
  current: boolean;
  lines: string[];
  projects: string[];
};
export type Education = { title: string; org: string; year: string; lines: string[] };

export type Profile = {
  name: string;
  shortName: string;
  role: string;
  addressLine: string;
  email: string;
  phones: string[];
  /** The line that answers on WhatsApp — digits only, as wa.me wants them. */
  whatsapp: string;
  linkedin: string;
  linkedinLabel: string;
  intro: string;
  profileText: string[];
  availability: { headline: string; body: string; points: string[] };
  competencies: Competency[];
  experience: Job[];
  education: Education[];
  certificates: string[];
  software: { name: string; level: number }[];
  languages: { name: string; level: string }[];
  aside: string[];
  developers: string[];
};

export const profileEn: Profile = {
  name: "Ahmed Yahia Rashid",
  shortName: "Ahmed Yahia",
  role: "Architect — finishing, execution & site supervision",
  addressLine: "First Settlement, New Cairo, Egypt",
  email: "ahmedyahiia6@gmail.com",
  phones: ["+20 101 152 2801", "+20 127 160 6050"],
  whatsapp: "201011522801",
  linkedin: "https://linkedin.com/in/ahmed-yehia-831736193",
  linkedinLabel: "linkedin.com/in/ahmed-yehia-831736193",

  intro:
    "I finish buildings. Eight years on site taking residential and public projects from foundation to handover — supervising the finishing trades, checking the drawing against what was actually built, and closing the snag list.",

  profileText: [
    "Architect with over eight years of experience across site execution, technical office work and design management, delivering residential and public projects from foundation stage through final handover.",
    "Experienced in high-end architectural finishing for international developers including SODIC, Palm Hills, Mountain View and Hyde Park, as well as government projects supervised by the Ministry of Justice and the Ministry of Health.",
    "Currently Senior Architect at Painite Architects, specialising in premium finishing materials and detail-level quality control.",
  ],

  availability: {
    headline: "Open to work abroad",
    body: "I am actively looking for a role outside Egypt and ready to relocate. The finishing standard I work to is the same one international developers specify, the drawings and submittals are in English, and I have already delivered a complete apartment to an owner living in Saudi Arabia who followed the whole programme from abroad. Visa sponsorship welcome.",
    points: [
      "Ready to relocate — Gulf, Europe, North Africa",
      "Remote technical office, BOQ and submittal review",
      "Arabic, English and Italian",
    ],
  },

  competencies: [
    {
      id: "site",
      title: "Execution & site",
      items: [
        "Site supervision",
        "Architectural finishing works",
        "Execution follow-up",
        "Technical review",
        "Project handover",
        "Snag-list closure",
      ],
    },
    {
      id: "office",
      title: "Technical office",
      items: [
        "Quantity take-off and inventory",
        "BOQ preparation",
        "Shop drawings review",
        "Architectural modifications",
        "Final design review",
      ],
    },
    {
      id: "management",
      title: "Management",
      items: [
        "Project management",
        "Contractor and subcontractor coordination",
        "Client relationship management",
        "Progress reporting",
        "Quality assurance",
      ],
    },
    {
      id: "design",
      title: "Design",
      items: [
        "Interior and exterior design",
        "High-end finishing material selection",
        "3D visualisation",
        "Manual design sketching",
      ],
    },
  ],

  experience: [
    {
      title: "Senior Architect",
      org: "Painite Architects",
      place: "Egypt",
      from: "2026",
      to: "Present",
      current: true,
      lines: [
        "Lead architect on high-end residential finishing packages, from material selection through to final handover.",
        "Source and evaluate new finishing materials, ensuring specification compliance and detail-level quality across all items.",
        "Manage design and execution follow-up for premium units in SODIC East and El Patio Oro.",
      ],
      projects: [],
    },
    {
      title: "Project Manager",
      org: "Creativity Design",
      place: "Interior & exterior design and decoration",
      from: "2023",
      to: "2025",
      current: false,
      lines: [
        "Managed full-cycle fit-out projects for premium residential units, coordinating design, procurement, execution and handover.",
        "Directed multidisciplinary site teams and subcontractors, controlling programme, quality and finishing standards.",
        "Delivered a complete apartment to an overseas owner, reporting and securing sign-off remotely at every stage.",
      ],
      projects: [
        "Hyde Park New Cairo",
        "Stone Residence",
        "Palm Hills",
        "One Katameya (Morshedy Group)",
        "Sama Tower, Maadi",
        "El-Rehab City",
        "First Settlement Duplex",
        "Degla Palms, 6th of October",
      ],
    },
    {
      title: "Site Supervision & Execution Engineer",
      org: "MHD Group",
      place: "Egypt",
      from: "2022",
      to: "2023",
      current: false,
      lines: [
        "Supervised the execution of all architectural finishing items to full detail level across multiple compound developments.",
        "Conducted technical reviews and inspections, resolving site discrepancies between drawings and as-built conditions.",
        "Reported progress and quality status directly to clients through continuous follow-up.",
      ],
      projects: ["Lake View Residence", "SODIC Villette", "Swan Lake", "Mountain View"],
    },
    {
      title: "Consultant Engineer",
      org: "Albonyan Consulting Office",
      place: "Ministry of Health projects",
      from: "May 2021",
      to: "Jun 2022",
      current: false,
      lines: [
        "Acted as consultant engineer on public healthcare projects delivered under Ministry of Health supervision.",
        "Supervised works at Sadr Abbasiya Hospital, including the conversion of hospital sections and sanitary insulation packages.",
        "Reviewed contractor submittals and verified compliance with approved drawings, specifications and government standards.",
      ],
      projects: [],
    },
    {
      title: "Site Architect Engineer",
      org: "Mega Structure Company",
      place: "Ministry of Justice projects",
      from: "Dec 2020",
      to: "Apr 2021",
      current: false,
      lines: [
        "Delivered and resolved finishing works for South Cairo Court and Taj Al-Dawal Court under Ministry of Justice supervision.",
        "Coordinated execution sequencing on occupied public buildings while maintaining programme and quality requirements.",
      ],
      projects: [],
    },
    {
      title: "Technical Office Engineer",
      org: "Eltizam Contractors",
      place: "Egypt",
      from: "2019",
      to: "2020",
      current: false,
      lines: [
        "Prepared quantity take-offs, assays and BOQ documentation supporting site execution and cost control.",
        "Produced and reviewed architectural modifications and issued-for-construction drawings.",
      ],
      projects: [],
    },
    {
      title: "Site Engineer",
      org: "Sama Company",
      place: "Egypt",
      from: "Jun 2018",
      to: "Jun 2019",
      current: false,
      lines: ["Supervised daily site activities, materials delivery and workmanship quality on residential projects."],
      projects: [],
    },
    {
      title: "Architecture Site Engineer",
      org: "Building Contracting Company",
      place: "Egypt",
      from: "2018",
      to: "2018",
      current: false,
      lines: ["Supported interior and exterior execution works, coordinating trades and monitoring finishing quality on site."],
      projects: [],
    },
    {
      title: "Site Trainee — Visualisation & Internal Finishing",
      org: "Field training",
      place: "Egypt",
      from: "2015",
      to: "2015",
      current: false,
      lines: ["First site exposure covering internal finishing works, manual design and architectural presentation techniques."],
      projects: [],
    },
  ],

  education: [
    {
      title: "BSc Architecture",
      org: "Modern Academy for Engineering and Technology",
      year: "2019",
      lines: [
        "Overall grade: Good (75%). Graduation project awarded Excellent.",
        "Graduation project: development of the Sayed Darwish Theatre, Alexandria — adaptive reuse and rehabilitation of a heritage performance venue.",
        "Currently enrolled in a postgraduate master's programme in architecture.",
      ],
    },
    {
      title: "Professional Diploma — Decoration & Architectural Finishing",
      org: "Instructor: Eng. Mohamed Badawy",
      year: "2019",
      lines: [],
    },
  ],

  certificates: [
    "AutoCAD 2D",
    "Architectural Modeling",
    "3ds Max (MTC)",
    "Site & Visualisation",
    "Interior & Exterior Design",
    "Adobe Photoshop CS6",
  ],

  software: [
    { name: "AutoCAD", level: 5 },
    { name: "3ds Max", level: 4 },
    { name: "Adobe Photoshop", level: 4 },
    { name: "Coohome — AI-assisted 2D & 3D plans", level: 4 },
    { name: "Microsoft Office (Excel, Word, PowerPoint)", level: 5 },
    { name: "Hand rendering & sketching", level: 5 },
  ],

  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Professional working" },
    { name: "Italian", level: "Elementary" },
  ],

  aside: [
    "Member of Enactus Egypt — student-led social entrepreneurship and community development.",
    "Competitive athlete: award winner in boxing and swimming, and an active equestrian.",
    "Screenwriting — an ongoing interest that feeds the visual storytelling side of the work.",
  ],

  developers: ["SODIC", "Palm Hills", "Mountain View", "Hyde Park", "Morshedy Group", "Ministry of Justice", "Ministry of Health"],
};
