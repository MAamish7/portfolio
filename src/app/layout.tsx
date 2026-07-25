import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import { Providers } from '@/app/providers';
import { SITE } from '@/constants/site';

import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.intro,
  keywords: [
    'Mohammad Aamish',
    'Mechanical Engineer',
    'SolidWorks',
    'ANSYS',
    'FEA',
    'CAD',
    'Embedded systems',
    'ESP8266',
    'SJEC Mangaluru',
    'VTU',
    'Portfolio',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: `${SITE.name} — Portfolio`,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.intro,
    images: [{ url: '/images/headshot-a.jpg', width: 1000, height: 1000, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.intro,
    images: ['/images/headshot-a.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/** Structured data so search engines read the page as a person profile. */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  telephone: SITE.phoneHref,
  url: SITE.url,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mangaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'St. Joseph Engineering College, Mangaluru' },
  knowsAbout: [
    'SolidWorks',
    'ANSYS Workbench',
    'Finite Element Analysis',
    'AutoCAD',
    'MATLAB',
    'Embedded Systems',
  ],
  sameAs: [SITE.socials.github, SITE.socials.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ink text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Keyboard users land here first */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
