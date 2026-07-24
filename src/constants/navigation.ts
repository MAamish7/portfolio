export type NavItem = {
  id: string;
  label: string;
  /** Shown in the mobile menu as a small ordinal. */
  index: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'projects', label: 'Work', index: '03' },
  { id: 'timeline', label: 'Timeline', index: '04' },
  { id: 'education', label: 'Education', index: '05' },
  { id: 'certificates', label: 'Certificates', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
];

/** Every id the scroll-spy should track, hero included. */
export const SECTION_IDS = ['hero', ...NAV_ITEMS.map((item) => item.id)];
