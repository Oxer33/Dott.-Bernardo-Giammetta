// =============================================================================
// ROOT LAYOUT - DOTT. BERNARDO GIAMMETTA
// Layout principale dell'applicazione con provider, font e metadata SEO
// =============================================================================

import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { NutriBot } from '@/components/chat/NutriBot';
import { SplashScreen } from '@/components/ui/SplashScreen';

// =============================================================================
// CONFIGURAZIONE FONT
// Inter: corpo testo, leggibilità ottimale
// Plus Jakarta Sans: titoli display, look moderno (alternativa a Clash Display)
// Playfair: accenti eleganti, citazioni
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// Plus Jakarta Sans come alternativa moderna a Clash Display
const clash = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-clash',
});

// =============================================================================
// METADATA SEO
// Ottimizzata per motori di ricerca e social sharing
// =============================================================================

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bernardogiammetta.com'),
  // Favicon PNG con G calligrafica elegante
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: 'Dott. Bernardo Giammetta | Biologo Nutrizionista',
    template: '%s | Dott. Bernardo Giammetta',
  },
  description: 'Biologo Nutrizionista specializzato in nutrizione funzionale, metabolismo e benessere. Percorsi personalizzati per raggiungere i tuoi obiettivi di salute.',
  keywords: [
    'nutrizionista',
    'biologo nutrizionista',
    'nutrizione funzionale',
    'dieta personalizzata',
    'metabolismo',
    'benessere',
    'salute',
    'alimentazione',
    'Bernardo Giammetta',
  ],
  authors: [{ name: 'Dott. Bernardo Giammetta' }],
  creator: 'Dott. Bernardo Giammetta',
  publisher: 'Dott. Bernardo Giammetta',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://www.bernardogiammetta.com',
    siteName: 'Dott. Bernardo Giammetta - Biologo Nutrizionista',
    title: 'Dott. Bernardo Giammetta | Biologo Nutrizionista',
    description: 'Biologo Nutrizionista specializzato in nutrizione funzionale, metabolismo e benessere. Percorsi personalizzati per la tua salute.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dott. Bernardo Giammetta - Biologo Nutrizionista',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dott. Bernardo Giammetta | Biologo Nutrizionista',
    description: 'Biologo Nutrizionista specializzato in nutrizione funzionale e benessere.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verifica-google-search-console',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F9F9' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// =============================================================================
// ROOT LAYOUT COMPONENT
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="it" 
      className={`${inter.variable} ${playfair.variable} ${clash.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect per performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Favicon - Logo BG rotondo SVG */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />

        {/* Schema.org JSON-LD per SEO avanzata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Physician',
              name: 'Dott. Bernardo Giammetta',
              description: 'Biologo Nutrizionista specializzato in nutrizione funzionale e metabolismo',
              image: 'https://www.bernardogiammetta.com/images/dott-giammetta.jpg',
              url: 'https://www.bernardogiammetta.com',
              telephone: '+39 392 0979135',
              email: 'info@bernardogiammetta.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Roma',
                addressCountry: 'IT',
              },
              medicalSpecialty: 'Nutritionist',
              priceRange: '€€',
              openingHours: 'Mo-Fr 09:00-18:00',
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-cream-50 text-sage-900 min-h-screen flex flex-col">
        <Providers>
          {/* Navbar sticky con effetto blur */}
          <Navbar />
          
          {/* Contenuto principale */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
          
          {/* Toast notifications */}
          <Toaster />
          
          {/* Scroll to top button */}
          <ScrollToTop />
          
          {/* Cookie consent banner GDPR */}
          <CookieConsent />
          
          {/* NutriBot AI Assistant */}
          <NutriBot />
          
          {/* Splash Screen */}
          <SplashScreen />
        </Providers>
      </body>
    </html>
  );
}
