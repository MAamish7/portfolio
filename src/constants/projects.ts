export type ProjectCategory = 'embedded' | 'simulation' | 'design';

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  role: string;
  summary: string;
  /** Bullets lifted from the engineering log — what was actually done. */
  highlights: string[];
  stats: { label: string; value: string }[];
  tech: string[];
  links: { demo?: string; github?: string };
  /** Drives the section's colour treatment and the WebGL exhibit swap. */
  accent: 'blue' | 'cyan' | 'violet';
  exhibit: 'torus' | 'lattice' | 'icosa';
};

export const PROJECTS: Project[] = [
  {
    id: 'gps-tracker',
    index: '01',
    title: 'GPS Tracking System',
    subtitle: 'ESP8266 NodeMCU × Neo-6M',
    category: 'embedded',
    categoryLabel: 'Embedded · IoT',
    year: '2025',
    role: 'Hardware & firmware',
    summary:
      'A real-time location tracker built on an ESP8266 NodeMCU paired with a Neo-6M GPS module, streaming live coordinates over Wi-Fi to a browser dashboard.',
    highlights: [
      'Programmed in the Arduino IDE using the TinyGPS++ library to parse NMEA sentences off the Neo-6M.',
      'Integrated Wi-Fi to push live coordinates to a lightweight web interface, refreshing every 10 seconds.',
      'Handled fix acquisition, serial timing and sensor interfacing on a single microcontroller.',
    ],
    stats: [
      { label: 'Update interval', value: '10 s' },
      { label: 'Controller', value: 'ESP8266' },
      { label: 'GPS module', value: 'Neo-6M' },
    ],
    tech: ['ESP8266', 'Neo-6M', 'Arduino IDE', 'TinyGPS++', 'Wi-Fi', 'C++'],
    links: { github: 'https://github.com/MAamish7' },
    accent: 'cyan',
    exhibit: 'lattice',
  },
  {
    id: 'fea-analysis',
    index: '02',
    title: 'Structural & Thermal Analysis',
    subtitle: 'ANSYS Workbench FEA study',
    category: 'simulation',
    categoryLabel: 'Simulation · FEA',
    year: '2025',
    role: 'Simulation engineer',
    summary:
      'Finite-element models built in ANSYS Workbench to evaluate stress, deformation and temperature distribution across mechanical components under applied loads.',
    highlights: [
      'Built structural and steady-state thermal models for components under representative load cases.',
      'Identified peak stress concentrations and traced them back to geometry decisions.',
      'Validated mesh convergence so reported results were independent of element size.',
    ],
    stats: [
      { label: 'Study types', value: 'Static · Thermal' },
      { label: 'Validation', value: 'Mesh convergence' },
      { label: 'Toolchain', value: 'ANSYS WB' },
    ],
    tech: ['ANSYS Workbench', 'FEA', 'Structural', 'Thermal', 'Mesh convergence', 'CAD'],
    links: {},
    accent: 'blue',
    exhibit: 'torus',
  },
  {
    id: 'springless-suspension',
    index: '03',
    title: 'Springless Suspension System',
    subtitle: 'Mechanism design in SolidWorks',
    category: 'design',
    categoryLabel: 'Mechanism · CAD',
    year: '2026',
    role: 'Design & analysis',
    summary:
      'A springless suspension mechanism modelled in SolidWorks as an alternative to conventional coil-spring systems, then analysed under varied loading.',
    highlights: [
      'Designed and 3D-modelled the full mechanism, including linkage geometry and travel envelope.',
      'Ran FEA to study load distribution, displacement and stress across loading conditions.',
      'Benchmarked behaviour against a conventional coil-spring baseline for comparison.',
    ],
    stats: [
      { label: 'Modelled in', value: 'SolidWorks' },
      { label: 'Analysis', value: 'FEA' },
      { label: 'Output', value: 'Prototype-ready' },
    ],
    tech: ['SolidWorks', '3D Modeling', 'CAD', 'FEA', 'Mechanism design', 'Prototyping'],
    links: {},
    accent: 'violet',
    exhibit: 'icosa',
  },
];

export const PROJECT_FILTERS: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'design', label: 'Design' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'embedded', label: 'Embedded' },
];
