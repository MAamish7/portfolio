import type { LucideIcon } from 'lucide-react';
import { Bot, Boxes, Code2, Cpu, Gauge, Wrench } from 'lucide-react';

export type Skill = {
  name: string;
  /** Self-assessed proficiency, drives the animated meter. */
  level: number;
};

export type SkillGroup = {
  id: string;
  code: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: 'blue' | 'cyan' | 'violet';
  skills: Skill[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'design',
    code: 'SYS-01',
    title: 'Design & CAD',
    blurb: 'Part and assembly modelling, drawings, and design intent that survives revision.',
    icon: Boxes,
    accent: 'blue',
    skills: [
      { name: 'SolidWorks', level: 85 },
      { name: 'AutoCAD', level: 78 },
      { name: '3D Modeling', level: 82 },
      { name: 'GD&T / Drawings', level: 70 },
    ],
  },
  {
    id: 'simulation',
    code: 'SYS-02',
    title: 'Simulation & Analysis',
    blurb: 'Structural and thermal FEA, mesh convergence, and reading results critically.',
    icon: Gauge,
    accent: 'cyan',
    skills: [
      { name: 'ANSYS Workbench', level: 80 },
      { name: 'Structural FEA', level: 78 },
      { name: 'Thermal Analysis', level: 74 },
      { name: 'MATLAB / Simulink', level: 70 },
    ],
  },
  {
    id: 'manufacturing',
    code: 'SYS-03',
    title: 'Manufacturing',
    blurb: 'Turning a model into a physical part — and designing so it can actually be made.',
    icon: Wrench,
    accent: 'violet',
    skills: [
      { name: '3D Printing', level: 76 },
      { name: 'CNC Machining', level: 70 },
      { name: 'Prototyping', level: 78 },
      { name: 'DFM Basics', level: 65 },
    ],
  },
  {
    id: 'programming',
    code: 'SYS-04',
    title: 'Programming',
    blurb: 'Enough software to make hardware talk, and enough web to ship interfaces for it.',
    icon: Code2,
    accent: 'blue',
    skills: [
      { name: 'C / C++', level: 74 },
      { name: 'Python', level: 68 },
      { name: 'JavaScript / TypeScript', level: 66 },
      { name: 'React / Next.js', level: 62 },
      { name: 'HTML / CSS', level: 80 },
    ],
  },
  {
    id: 'embedded',
    code: 'SYS-05',
    title: 'Embedded & IoT',
    blurb: 'Microcontrollers, sensors, and getting live data off a board and onto a screen.',
    icon: Cpu,
    accent: 'cyan',
    skills: [
      { name: 'ESP8266 / NodeMCU', level: 80 },
      { name: 'Arduino IDE', level: 82 },
      { name: 'Sensor Interfacing', level: 76 },
      { name: 'GPS Integration', level: 74 },
    ],
  },
  {
    id: 'ai',
    code: 'SYS-06',
    title: 'AI Tooling',
    blurb: 'Using generative tools as a design accelerator — concepts, code review, and docs.',
    icon: Bot,
    accent: 'violet',
    skills: [
      { name: 'ChatGPT', level: 85 },
      { name: 'Claude', level: 82 },
      { name: 'Gemini', level: 75 },
      { name: 'Hugging Face', level: 62 },
      { name: 'ComfyUI', level: 68 },
      { name: 'Midjourney', level: 70 },
    ],
  },
];

/** Flat tag cloud used by the hero ticker and the About section. */
export const CORE_TOOLS = [
  'SolidWorks',
  'ANSYS',
  'AutoCAD',
  'MATLAB',
  'Simulink',
  'Arduino',
  'ESP8266',
  'Python',
  'TypeScript',
  'React',
];
