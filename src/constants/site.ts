/** Single source of truth for identity, contact details and SEO copy. */

export const SITE = {
  name: 'Mohammad Aamish',
  shortName: 'M. Aamish',
  initials: 'MA',
  role: 'Mechanical Engineer',
  roles: [
    'Mechanical Engineer',
    'CAD & Simulation',
    'FEA Analyst',
    'Embedded Tinkerer',
    'Design Engineer',
  ],
  tagline: 'Design → Simulate → Build',
  headline: {
    line1: 'Mechanical',
    line2: 'Engineer',
  },
  intro:
    'B.E. Mechanical Engineering student at SJEC Mangaluru. I model parts in SolidWorks, prove them out in ANSYS, and build the prototypes that make them real.',
  location: 'Mangaluru, Karnataka, India',
  timezone: 'IST · UTC+5:30',
  availability: 'Open to internships — 2026',
  graduation: '2027',
  url: 'https://mohammad-aamish.vercel.app',
  email: 'aamishmohammad9@gmail.com',
  phone: '+91 72594 74527',
  phoneHref: '+917259474527',
  resume: '/resume/Mohammad_Aamish_Resume.pdf',
  socials: {
    github: 'https://github.com/MAamish7',
    linkedin: 'https://www.linkedin.com/in/mohammad-aamish-b0b505307/',
  },
  languages: ['English', 'Kannada', 'Hindi', 'Urdu', 'Malayalam'],
} as const;

export const OBJECTIVE =
  'Mechanical Engineering student seeking an opportunity to learn, grow and gain practical experience while contributing positively to the organization. Skilled in SolidWorks, ANSYS and MATLAB/Simulink, with a focus on strengthening technical and problem-solving abilities through real-world work.';

export const STATS = [
  { value: 3, suffix: '+', label: 'Engineering projects', hint: 'CAD · FEA · Embedded' },
  { value: 7, suffix: '', label: 'Certifications', hint: 'Coursera · NPTEL · Cisco' },
  { value: 7.5, suffix: '/10', label: 'Current CGPA', hint: 'VTU · SJEC', decimals: 1 },
  { value: 5, suffix: '', label: 'Languages spoken', hint: 'EN · KN · HI · UR · ML' },
] as const;

export const MARQUEE_WORDS = [
  'SolidWorks',
  'ANSYS Workbench',
  'Finite Element Analysis',
  'MATLAB',
  'Simulink',
  'AutoCAD',
  '3D Printing',
  'CNC Machining',
  'ESP8266',
  'Sensor Interfacing',
  'Thermal Analysis',
  'Mechanism Design',
] as const;
