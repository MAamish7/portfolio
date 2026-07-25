export type EducationEntry = {
  period: string;
  degree: string;
  institution: string;
  scoreLabel: string;
  score: string;
  detail: string;
  current?: boolean;
};

export const EDUCATION: EducationEntry[] = [
  {
    period: '2023 — 2027',
    degree: 'B.E. in Mechanical Engineering',
    institution: 'St. Joseph Engineering College (SJEC), Mangaluru · VTU',
    scoreLabel: 'CGPA',
    score: '7.50 / 10',
    detail:
      'Core mechanical curriculum with a self-directed focus on CAD, finite-element analysis and mechatronics.',
    current: true,
  },
  {
    period: '2021 — 2023',
    degree: 'Pre-University Course (PCM)',
    institution: 'KVG Amarajyothi PU College, Sullia',
    scoreLabel: 'Percentage',
    score: '77.33%',
    detail: 'Physics, Chemistry and Mathematics — the groundwork for an engineering degree.',
  },
  {
    period: '— 2021',
    degree: 'Secondary School Leaving Certificate',
    institution: 'St. Joseph English Medium High School, Sullia',
    scoreLabel: 'Percentage',
    score: '86.56%',
    detail: 'Karnataka State Board, class of 2021.',
  },
];

export type TimelineEntry = {
  year: string;
  title: string;
  org: string;
  description: string;
  kind: 'education' | 'project' | 'credential' | 'milestone';
};

/**
 * A single chronological track of what has actually happened so far —
 * coursework, builds and credentials rather than employment history.
 */
export const TIMELINE: TimelineEntry[] = [
  {
    year: '2023',
    title: 'Started B.E. Mechanical Engineering',
    org: 'SJEC Mangaluru · VTU',
    description:
      'Began the four-year mechanical programme and started building a CAD-first workflow alongside coursework.',
    kind: 'education',
  },
  {
    year: '2024',
    title: 'Generative AI with Large Language Models',
    org: 'DeepLearning.AI & AWS · Coursera',
    description:
      'Completed the LLM specialisation and folded AI tooling into everyday design, documentation and debugging.',
    kind: 'credential',
  },
  {
    year: '2024',
    title: 'Introduction to Cybersecurity',
    org: 'Cisco Networking Academy',
    description: 'Fundamentals of network security, threat models and safe engineering practice.',
    kind: 'credential',
  },
  {
    year: '2025',
    title: 'GPS Tracking System build',
    org: 'Independent project',
    description:
      'Designed and shipped a working ESP8266 + Neo-6M tracker streaming live coordinates to a web interface.',
    kind: 'project',
  },
  {
    year: '2025',
    title: 'ASME Membership',
    org: 'American Society of Mechanical Engineers',
    description:
      'Joined ASME for access to standards, journals and the wider engineering community.',
    kind: 'milestone',
  },
  {
    year: '2025',
    title: 'ANSYS structural & thermal studies',
    org: 'Academic project work',
    description:
      'Built FEA models evaluating stress, deformation and temperature distribution, validated by mesh convergence.',
    kind: 'project',
  },
  {
    year: '2026',
    title: 'Springless Suspension System',
    org: 'Design project',
    description:
      'Modelled a springless suspension mechanism in SolidWorks and analysed it against a coil-spring baseline.',
    kind: 'project',
  },
  {
    year: '2026',
    title: 'Principles of Industrial Engineering',
    org: 'NPTEL · IIT',
    description:
      'Industrial engineering fundamentals — process design, work study and optimisation.',
    kind: 'credential',
  },
  {
    year: '2027',
    title: 'Graduation — B.E. Mechanical',
    org: 'SJEC Mangaluru',
    description:
      'Expected completion. Actively looking for internships in design and mechatronics before then.',
    kind: 'milestone',
  },
];
