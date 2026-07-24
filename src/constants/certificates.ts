export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /** Public verification link, when the issuer provides one. */
  url?: string;
  description: string;
  skills: string[];
  accent: 'blue' | 'cyan' | 'violet';
};

export const CERTIFICATES: Certificate[] = [
  {
    id: 'genai-llm',
    title: 'Generative AI with Large Language Models',
    issuer: 'DeepLearning.AI & AWS · Coursera',
    date: 'Jul 2024',
    url: 'https://coursera.org/share/ce9b14669661dabbb26a990b80e81a13',
    description:
      'Transformer architecture, prompt engineering, fine-tuning and deploying LLM-backed applications.',
    skills: ['LLMs', 'Prompt engineering', 'Fine-tuning'],
    accent: 'violet',
  },
  {
    id: 'fea-convergence',
    title: 'FEA: Convergence & Mesh Independence',
    issuer: 'Coursera',
    date: 'Jun 2026',
    url: 'https://coursera.org/share/c6ada1d63e733433ba51f9616ff4eca5',
    description:
      'Verifying finite-element results by driving mesh refinement until the solution stops moving.',
    skills: ['FEA', 'Mesh convergence', 'Verification'],
    accent: 'blue',
  },
  {
    id: 'industrial-engineering',
    title: 'Principles of Industrial Engineering',
    issuer: 'NPTEL · IIT',
    date: 'Apr 2026',
    description:
      'Work study, process design, productivity measurement and industrial optimisation.',
    skills: ['Industrial engineering', 'Process design', 'Optimisation'],
    accent: 'cyan',
  },
  {
    id: 'asme',
    title: 'ASME Membership',
    issuer: 'American Society of Mechanical Engineers',
    date: '2025',
    description:
      'Professional membership — access to mechanical engineering standards, journals and community.',
    skills: ['Standards', 'Professional body'],
    accent: 'blue',
  },
  {
    id: 'net-zero',
    title: 'Net Zero Certification',
    issuer: 'Industry certificate',
    date: '2025',
    description:
      'Decarbonisation fundamentals and what net-zero targets mean for engineering practice.',
    skills: ['Sustainability', 'Energy'],
    accent: 'cyan',
  },
  {
    id: 'cybersecurity',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: '2024',
    description:
      'Threat landscape, network defence basics and secure practice for connected devices.',
    skills: ['Security basics', 'Networking'],
    accent: 'violet',
  },
  {
    id: 'e-business',
    title: 'E-Business',
    issuer: 'Online course',
    date: '2025',
    description: 'Digital business models, e-commerce operations and the systems behind them.',
    skills: ['E-commerce', 'Business systems'],
    accent: 'blue',
  },
];
