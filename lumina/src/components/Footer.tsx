import { motion } from 'motion/react';
import { Facebook, Instagram, Music2, Twitter, Youtube } from 'lucide-react';

import { LuminaMark } from '@/components/LuminaMark';

const LINK_GROUPS = [
  {
    title: 'Discover',
    links: [
      'Labs & Workshops',
      'Deep Dive Series',
      'Global Circle',
      'Resource Vault',
      'Future Roadmap',
    ],
  },
  {
    title: 'The Mission',
    links: ['Origin Story', 'The Collective', 'Newsroom Hub', 'Join the Team'],
  },
  {
    title: 'Concierge',
    links: ['Get in Touch', 'Legal Privacy', 'User Agreement', 'Report Concern'],
  },
];

const SOCIALS = [
  { Icon: Music2, label: 'TikTok' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Youtube, label: 'YouTube' },
  { Icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      className="liquid-glass mt-32 w-full rounded-3xl p-6 text-white/70 md:mt-64 md:p-10"
    >
      {/* Top grid */}
      <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 text-white">
            <LuminaMark />
            <span className="text-xl font-medium">LUMINA</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Lumina provides premium clarity on global events and cosmic wonders - shared with all
            for free.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                {group.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:gap-4">
        <p className="text-[10px] uppercase tracking-widest opacity-50">Curated by @GotInGeorgiG</p>

        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest opacity-50">Join the Journey:</span>
          <div className="flex flex-row items-center gap-4">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="opacity-70 transition-colors hover:text-white hover:opacity-100"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
